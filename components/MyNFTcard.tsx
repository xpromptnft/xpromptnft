import React, { Component, useEffect, useState } from 'react'
import { useAccount, useConnect, useDisconnect, useNetwork } from 'wagmi'

import Moralis from 'moralis'
import { EvmChain, EvmChainish } from '@moralisweb3/common-evm-utils'
import { Box, Text, Flex, Anchor, Button, Grid } from './primitives'
import chains from 'utils/chains'

export interface INFT {
  description?: string
  image_url?: string
  name?: string
  owner?: string
  tokenAddress?: string
  url?: string
}

Moralis.start({
  apiKey: process.env.NEXT_PUBLIC_MORALILS_API_KEY,
})

export const getAllNftData = async (address: any, chainID: any) => {
  try {
    const chainName = {
      chains: [
        {
          id: '80001',
          name: EvmChain.MUMBAI,
        },
        {
          id: '5',
          name: EvmChain.GOERLI,
        },
        {
          id: '1',
          name: EvmChain.ETHEREUM,
        },
        {
          id: '42161',
          name: EvmChain.ARBITRUM,
        },
        {
          id: '137',
          name: EvmChain.POLYGON,
        },
        {
          id: '1',
          name: EvmChain.ETHEREUM,
        },
        {
          id: '56',
          name: EvmChain.BSC,
        },
        {
          id: '250',
          name: EvmChain.FANTOM,
        },
        {
          id: '97',
          name: EvmChain.BSC_TESTNET,
        },
      ],
    }

    const finalchainid = chainName.chains.filter(({ id }) => id == chainID)[0]
      .name

    console.log('actual id from array is -------->>>>>>>', finalchainid)
    // const chaincurrent = {
    //   MUMBAI: EvmChain.GOERLI,
    // }
    const chain = finalchainid

    console.log('evm chain is ===========>>>>>>>>>', chain)
    const response = await Moralis.EvmApi.nft.getWalletNFTs({
      address,
      chain,
    })
    const nfts: any = []
    // console.log('address ======>>>>>>>>>>>', address)
    response?.result.map((data) => {
      if (data.metadata) {
        const metadata: any = data.metadata
        nfts.push({
          description: metadata?.description,
          image_url: metadata?.image_url ? metadata.image_url : metadata?.image,
          name: metadata?.name
            ? metadata.name
            : `${data.name} #${data.tokenId}`,
          owner: address,
          tokenAddress: data.tokenAddress['_value'],
          url: `https://opensea.io/assets/ethereum/${data.tokenAddress['_value']}/${data.tokenId}`,
        })
      }
    })
    console.log('all nfts are ===========>>>>>>>>>', nfts)
    return nfts
  } catch (e) {
    console.error('aa rerror bc ==========>>>>>>>>', e)
  }
}

export function MyNFTcard() {
  const [allNFTs, setAllNFTs] = useState([])
  const { address } = useAccount()
  const { chain, chains } = useNetwork()

  console.log('current chain name is --------- >>', chain?.id)

  async function getAllNfts() {
    setAllNFTs(await getAllNftData(address, chain?.id))
  }

  useEffect(() => {
    getAllNfts()
  }, [])

  return (
    <>
      {allNFTs && allNFTs.length !== 0 ? (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            margin: '30px',
            cursor: 'pointer',
            justifyContent: 'center',
          }}
        >
          {allNFTs.map((item: INFT) => {
            return (
              <div>
                <Box
                  css={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '315px',
                    background: '$gray3',
                    overflow: 'hidden',
                    margin: '10px',
                    borderRadius: '8px',
                    boxShadow: '0 8px 12px 0px rgb(0 0 0 / 0.1)',
                  }}
                >
                  <img
                    src={item.image_url}
                    alt={item.name}
                    style={{
                      width: '100%',
                      transition: 'transform .3s ease-in-out',
                      maxHeight: 720,
                      height: '100%',
                      borderRadius: '8px',
                      aspectRatio: '1/1',
                    }}
                  />

                  <div style={{ padding: '13px' }}>
                    <Text style="h5">{item.name}</Text>

                    <p>
                      {' '}
                      <b> Description : </b> {item.description}
                    </p>
                    <p>{item.tokenAddress}</p>
                  </div>
                </Box>
              </div>
            )
          })}
        </div>
      ) : (
        <>
          <Flex
            css={{ flax: 2, justifyContent: 'center', alignItems: 'center' }}
          >
            <h1>No NFTs</h1>
          </Flex>
        </>
      )}
    </>
  )
}
