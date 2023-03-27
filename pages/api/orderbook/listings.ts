import {NextApiRequest, NextApiResponse} from "next"
import { Redis } from '@upstash/redis'
import {ethers} from "ethers"
import db from "lib/db"
import {paths} from "@nftearth/reservoir-sdk"
import fetcher from "utils/fetcher"
import supportedChains from "utils/chains"
import {ConsiderationItem, ItemType, OfferItem, Orders} from "types/nftearth.d"

const redis = Redis.fromEnv()
const NFTItem = [ItemType.ERC721, ItemType.ERC1155, ItemType.ERC721_WITH_CRITERIA, ItemType.ERC1155_WITH_CRITERIA]
const PaymentItem = [ItemType.ERC20, ItemType.NATIVE]
const account = db.collection('account')
const entry = db.collection('quest_entry')

const EXTRA_REWARD_PER_HOUR_PERIOD=0.00000001
const chainToNFTE: Record<number, string> = {
  10: '0xc96f4f893286137ac17e07ae7f217ffca5db3ab6',
  42161: '0xb261104a83887ae92392fb5ce5899fcfe5481456'
}

const handleOrderbookListings = async (req: NextApiRequest, res: NextApiResponse) => {
  const apiKey = req.headers['x-api-key']
  if (!apiKey || apiKey !== process.env.ORDERBOOK_API_KEY) {
    res.status(405).send({message: 'Invalid api key'})
    return
  }
  if (req.method !== 'POST') {
    res.status(405).send({message: 'Only POST requests allowed'})
    return
  }

  const { parameters, chainId, criteria, signature } : Orders = typeof req.body === 'string' ? JSON.parse(req.body) : req.body
  const chain = supportedChains.find(c => c.id === chainId)

  const accountData = await account.findOne({
    wallet: parameters.offerer.toLowerCase()
  }).catch(() => null)

  const questEntry = await entry.findOne({
    wallet: parameters.offerer.toLowerCase()
  }).catch(() => null) || []

  const nft: OfferItem[] = parameters.offer.filter(o => NFTItem.includes(o.itemType))
  const payment: ConsiderationItem[] = parameters.consideration.filter(o => PaymentItem.includes(o.itemType))
  const period = parameters.endTime - parameters.startTime

  const collectionQuery: paths["/collections/v5"]["get"]["parameters"]["query"] = {
    id: nft[0]?.token,
    includeTopBid: true
  }

  const { data } = await fetcher(`${chain?.reservoirBaseUrl}/collections/v5`, collectionQuery, {
    headers: {
      'x-api-key': chain?.apiKey || '',
    }
  })

  const collections: paths["/collections/v5"]["get"]["responses"]["200"]["schema"]["collections"] = data?.collections || []
  const collection = collections?.[0]

  if (accountData && collection) {
    const isNFTE = payment[0].token.toLowerCase() === chainToNFTE[chainId];
    let value = +ethers.utils.formatEther(payment[0]?.startAmount || '0').toString()

    // Temp Fix
    if (isNFTE) {
      value = value * 0.000032126308
    }

    const collectionVolume = +`${collection.volume?.allTime}`
    const topBidValue = +`${collection.topBid?.price?.amount?.native}`
    const floorValue = +`${collection.floorAsk?.price?.amount?.native}`
    const tokenValue = floorValue || topBidValue || 0
    const percentDiff = (tokenValue - value) / ((tokenValue + value) / 2)
    let reward = collectionVolume * tokenValue

    reward += reward * (period * EXTRA_REWARD_PER_HOUR_PERIOD)
    reward += reward * percentDiff

    if (reward < 0 || value <= 0 || questEntry.length < 7) {
      reward = 0
    }

    const finalReward = reward * (isNFTE ? 2 : 1)

    console.info(`New Listing Reward`, {
      offerer: parameters.offerer,
      collectionVolume,
      tokenValue,
      value,
      percentDiff,
      finalReward,
      isNFTE
    })

    const existingReward = await redis
      .get(`list:${chainId}:${parameters.offerer}:${nft[0]?.token}:${nft[0]?.identifierOrCriteria}`)
      .then((res) => res as number)
      .catch(() => 0)
    const cleanedReward = finalReward - existingReward

    await redis.setex(`list:${chainId}:${parameters.offerer}:${nft[0]?.token}:${nft[0]?.identifierOrCriteria}`, period, cleanedReward)

    await account.updateOne({
      wallet: parameters.offerer.toLowerCase()
    }, {
      $inc: {
        listingExp: cleanedReward,
        exp: cleanedReward
      }
    })
  }

  return res.json({
    message: 'Listing Accepted'
  })
}

export default handleOrderbookListings