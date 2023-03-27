import React, { useContext, useEffect, useState } from 'react'
import {
  faArrowLeft,
  faCircleExclamation,
  faRefresh,
  faRectangleList,
  faUserGroup,
  faTableCells,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { paths } from '@nftearth/reservoir-sdk'
import {
  TokenMedia,
  useAttributes,
  useCollections,
  useDynamicTokens,
  useTokenOpenseaBanned,
  useUserTokens,
} from '@nftearth/reservoir-kit-ui'
import Layout from 'components/Layout'
import {
  Flex,
  Text,
  Button,
  Tooltip,
  Anchor,
  Grid,
  Box,
  CollapsibleContent,
} from 'components/primitives'
import { TabsList, TabsTrigger, TabsContent } from 'components/primitives/Tab'
import * as Tabs from '@radix-ui/react-tabs'
import * as Collapsible from '@radix-ui/react-collapsible'
import AttributeCard from 'components/token/AttributeCard'
import { PriceData } from 'components/token/PriceData'
import RarityRank from 'components/token/RarityRank'
import { TokenActions } from 'components/token/TokenActions'
import {
  GetStaticProps,
  GetStaticPaths,
  InferGetStaticPropsType,
  NextPage,
} from 'next'
import Link from 'next/link'
import { jsNumberForAddress } from 'react-jazzicon'
import Jazzicon from 'react-jazzicon/dist/Jazzicon'
import fetcher from 'utils/fetcher'
import { useAccount } from 'wagmi'
import { TokenInfo } from 'components/token/TokenInfo'
import { useMediaQuery } from 'react-responsive'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { ToastContext } from 'context/ToastContextProvider'
import { NORMALIZE_ROYALTIES } from 'pages/_app'
import { useENSResolver, useMarketplaceChain, useMounted } from 'hooks'
import { spin } from 'components/common/LoadingSpinner'
import FullscreenMedia from 'components/token/FullscreenMedia'
import { OpenSeaVerified } from 'components/common/OpenSeaVerified'
import { OwnersModal } from 'components/token/OwnersModal'
import { TokenActivityTable } from 'components/token/TokenActivityTable'
import { TokenOffersTable } from 'components/token/TokenOffersTable'
import { TokenListingsTable } from 'components/token/TokenListingsTable'
import { formatNumber } from 'utils/numbers'
import supportedChains, { DefaultChain } from 'utils/chains'
import { NAVBAR_HEIGHT } from 'components/navbar'
import { useTheme } from 'next-themes'

type Props = InferGetStaticPropsType<typeof getStaticProps>

const TokenPage: NextPage<Props> = ({ id, collectionId, ssr }) => {
  const { theme } = useTheme()
  const router = useRouter()
  const { addToast } = useContext(ToastContext)
  const account = useAccount()
  const isMounted = useMounted()
  const isSmallDevice = useMediaQuery({ maxWidth: 900 }) && isMounted
  const [tabValue, setTabValue] = useState('description')
  const [isRefreshing, setIsRefreshing] = useState(false)
  const { id: chainId, proxyApi } = useMarketplaceChain()
  const contract = collectionId ? collectionId?.split(':')[0] : undefined
  const { data: collections } = useCollections(
    {
      contract: contract,
    },
    {
      fallbackData: [ssr.collection],
    },
    chainId
  )
  const collection = collections && collections[0] ? collections[0] : null

  const { data: tokens, mutate } = useDynamicTokens(
    {
      tokens: [`${contract}:${id}`],
      includeAttributes: true,
      includeTopBid: true,
      includeOwnerCount: true,
      includeItemCount: true,
    },
    {
      isPaused() {
        return !contract || !id
      },
      fallbackData: ssr.tokens ? [ssr.tokens] : undefined,
    },
    chainId
  )
  const flagged = useTokenOpenseaBanned(collectionId, id)
  const token = tokens && tokens[0] ? tokens[0] : undefined
  const checkUserOwnership = token?.token?.kind === 'erc1155'

  const { data: userTokens } = useUserTokens(
    checkUserOwnership ? account.address : undefined,
    {
      tokens: [`${contract}:${id}`],
    }
  )

  const attributesData = useAttributes(id, chainId)

  const isOwner =
    userTokens &&
    userTokens[0] &&
    userTokens[0].ownership?.tokenCount &&
    +userTokens[0].ownership.tokenCount > 0
      ? true
      : token?.token?.owner?.toLowerCase() === account?.address?.toLowerCase()
  const owner = isOwner ? account?.address : token?.token?.owner
  const { displayName: ownerFormatted } = useENSResolver(token?.token?.owner)

  const tokenName = `${token?.token?.name || `#${token?.token?.tokenId}`}`

  const hasAttributes =
    token?.token?.attributes && token?.token?.attributes.length > 0

  useEffect(() => {
    isMounted && isSmallDevice && hasAttributes
      ? setTabValue('attributes')
      : setTabValue('description')
  }, [isSmallDevice])

  const pageTitle = token?.token?.name
    ? token.token.name
    : `${token?.token?.tokenId} - ${token?.token?.collection?.name}`

  return (
    <Layout>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={collection?.description as string} />
        <meta name="twitter:title" content={pageTitle} />
        <meta
          name="twitter:image"
          content={token?.token?.image || collection?.banner}
        />
        <meta name="og:title" content={pageTitle} />
        <meta
          property="og:image"
          content={token?.token?.image || collection?.banner}
        />
        <a href="#">bcbcbcbcbcbcb</a>
      </Head>
      <Flex
        justify="center"
        css={{
          maxWidth: 1175,
          mt: 10,
          pb: 30,
          marginLeft: 'auto',
          marginRight: 'auto',
          px: '$1',
          gap: 20,
          flexDirection: 'column',
          alignItems: 'center',
          '@md': {
            mt: 48,
            px: '$3',
            flexDirection: 'row',
            gap: 40,
            alignItems: 'flex-start',
          },
          '@lg': {
            gap: 80,
          },
        }}
      >
        <Flex
          direction="column"
          css={{
            maxWidth: '100%',
            flex: 1,
            width: '100%',
            '@md': { maxWidth: 445 },
            position: 'relative',
            '@sm': {
              '>button': {
                height: 0,
                opacity: 0,
                transition: 'opacity .3s',
              },
            },
            ':hover >button': {
              opacity: 1,
              transition: 'opacity .3s',
            },
          }}
        >
          <Box
            css={{
              backgroundColor: '$gray3',
              borderRadius: '$lg',
              '@sm': {
                button: {
                  height: 0,
                  opacity: 0,
                  transition: 'opacity .3s',
                },
              },
              ':hover button': {
                opacity: 1,
                transition: 'opacity .3s',
              },
            }}
          >
            <TokenMedia
              token={token?.token}
              videoOptions={{ autoPlay: true, muted: true }}
              style={{
                width: '100%',
                height: 'auto',
                minHeight: isMounted && isSmallDevice ? 300 : 445,
                borderRadius: '$lg',
                overflow: 'hidden',
              }}
              onRefreshToken={() => {
                mutate?.()
                addToast?.({
                  title: 'Refresh token',
                  description: 'Request to refresh this token was accepted.',
                })
              }}
            />
            <FullscreenMedia token={token} />
          </Box>
          {hasAttributes && !isSmallDevice && (
            <Grid
              css={{
                maxWidth: '100%',
                width: '100%',
                maxHeight: 600,
                overflowY: 'scroll',
                gridTemplateColumns: '1fr 1fr',
                gap: '$3',
                mt: 24,
              }}
            >
              {token?.token?.attributes?.map((attribute) => (
                <AttributeCard
                  key={`${attribute.key}-${attribute.value}`}
                  attribute={attribute}
                  collectionTokenCount={collection?.tokenCount || 0}
                  collectionId={collection?.id}
                />
              ))}
            </Grid>
          )}
          {!isSmallDevice && (
            <Collapsible.Root defaultOpen={true} style={{ width: '100%' }}>
              <Collapsible.Trigger asChild>
                <Flex
                  direction="row"
                  align="center"
                  css={{
                    px: '$4',
                    py: '$3',
                    backgroundColor:
                      theme === 'light' ? '$primary11' : '$primary6',
                    mt: 30,
                    cursor: 'pointer',
                  }}
                >
                  <FontAwesomeIcon icon={faRectangleList} />
                  <Text style="h6" css={{ ml: '$4' }}>
                    Description
                  </Text>
                </Flex>
              </Collapsible.Trigger>
              <CollapsibleContent
                css={{
                  position: 'sticky',
                  top: 16 + 80,
                  height: `calc(50vh - ${NAVBAR_HEIGHT}px - 32px)`,
                  overflow: 'auto',
                  marginBottom: 16,
                  borderRadius: '$base',
                  p: '$2',
                }}
              >
                <Box
                  css={{
                    '& > div:first-of-type': {
                      p: '$4',
                    },
                  }}
                >
                  {collection && (
                    <TokenInfo token={token} collection={collection} />
                  )}
                </Box>
              </CollapsibleContent>
            </Collapsible.Root>
          )}
        </Flex>
        <Flex
          direction="column"
          css={{
            flex: 1,
            px: '$4',
            width: '100%',
            '@md': {
              px: 0,
              maxWidth: '60%',
              overflow: 'hidden',
            },
          }}
        >
          <Flex justify="between" align="center" css={{ mb: 20 }}>
            <Flex align="center" css={{ mr: '$2', gap: '$2' }}>
              <Link
                href={`/collection/${router.query.chain}/${collection?.id}`}
                legacyBehavior={true}
              >
                <Anchor
                  color="primary"
                  css={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '$2',
                  }}
                >
                  <FontAwesomeIcon icon={faArrowLeft} height={16} />
                  <Text css={{ color: 'inherit' }} style="subtitle1" ellipsify>
                    {collection?.name}
                  </Text>
                </Anchor>
              </Link>
              <OpenSeaVerified
                openseaVerificationStatus={
                  collection?.openseaVerificationStatus
                }
              />
            </Flex>
            <Button
              onClick={(e) => {
                if (isRefreshing) {
                  e.preventDefault()
                  return
                }
                setIsRefreshing(true)
                fetcher(`${proxyApi}/tokens/refresh/v1`, undefined, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ token: `${contract}:${id}` }),
                })
                  .then(({ response }) => {
                    if (response.status === 200) {
                      addToast?.({
                        title: 'Refresh token',
                        description:
                          'Request to refresh this token was accepted.',
                      })
                    } else {
                      throw 'Request Failed'
                    }
                    setIsRefreshing(false)
                  })
                  .catch((e) => {
                    addToast?.({
                      title: 'Refresh token failed',
                      description:
                        'We have queued this item for an update, check back in a few.',
                    })
                    setIsRefreshing(false)
                    throw e
                  })
              }}
              disabled={isRefreshing}
              color="gray3"
              size="xs"
              css={{ cursor: isRefreshing ? 'not-allowed' : 'pointer' }}
            >
              <Box
                css={{
                  animation: isRefreshing
                    ? `${spin} 1s cubic-bezier(0.76, 0.35, 0.2, 0.7) infinite`
                    : 'none',
                }}
              >
                <FontAwesomeIcon icon={faRefresh} width={16} height={16} />
              </Box>
            </Button>
          </Flex>
          <Flex align="center" css={{ gap: '$2' }}>
            <Text style="h4" css={{ wordBreak: 'break-all' }}>
              {tokenName}
            </Text>
            {flagged && (
              <Tooltip
                content={
                  <Text style="body2" as="p">
                    Not tradeable on OpenSea
                  </Text>
                }
              >
                <Text css={{ color: '$red10' }}>
                  <FontAwesomeIcon
                    icon={faCircleExclamation}
                    width={16}
                    height={16}
                  />
                </Text>
              </Tooltip>
            )}
          </Flex>
          {token && (
            <>
              {token.token?.kind === 'erc1155' ? (
                <Flex>
                  <OwnersModal
                    token={`${token.token?.collection?.id}:${token.token?.tokenId}`}
                  >
                    <Button color="ghost" css={{ mt: '$2', mr: '$6' }}>
                      <FontAwesomeIcon icon={faUserGroup} size="lg" />
                      <Text style="subtitle3" color="subtle" css={{ mx: '$2' }}>
                        {`${formatNumber(token.token?.ownerCount)} owners`}
                      </Text>
                    </Button>
                  </OwnersModal>
                  <Flex align="center" css={{ mt: '$2' }}>
                    <FontAwesomeIcon icon={faTableCells} size="lg" />
                    <Text style="subtitle3" color="subtle" css={{ mx: '$2' }}>
                      {`${formatNumber(token.token?.itemCount)} items`}
                    </Text>
                  </Flex>
                </Flex>
              ) : (
                <Flex align="center" css={{ mt: '$2' }}>
                  <Text style="subtitle3" color="subtle" css={{ mr: '$2' }}>
                    Owner
                  </Text>
                  <Jazzicon
                    diameter={16}
                    seed={jsNumberForAddress(owner || '')}
                  />
                  <Link href={`/profile/${owner}`} legacyBehavior={true}>
                    <Anchor color="primary" weight="normal" css={{ ml: '$1' }}>
                      {isMounted ? ownerFormatted : ''}
                    </Anchor>
                  </Link>
                </Flex>
              )}
              <RarityRank
                token={token}
                collection={collection}
                collectionAttributes={attributesData?.data}
              />
              <PriceData token={token} />
              {isMounted && (
                <TokenActions
                  token={token}
                  isOwner={isOwner}
                  mutate={mutate}
                  account={account}
                />
              )}
              {isSmallDevice && (
                <Tabs.Root
                  value={tabValue}
                  onValueChange={(value) => setTabValue(value)}
                >
                  <TabsList>
                    <TabsTrigger value="description">Description</TabsTrigger>
                    {isMounted && hasAttributes && (
                      <TabsTrigger value="attributes">Attributes</TabsTrigger>
                    )}
                  </TabsList>
                  <TabsContent value="description">
                    {collection && (
                      <TokenInfo token={token} collection={collection} />
                    )}
                  </TabsContent>
                  <TabsContent value="attributes">
                    {token?.token?.attributes && (
                      <Grid
                        css={{
                          gap: '$3',
                          mt: 24,
                          maxHeight: 300,
                          overflowY: 'auto',
                          gridTemplateColumns: '1fr',
                          '@sm': {
                            gridTemplateColumns: '1fr 1fr',
                          },
                        }}
                      >
                        {token?.token?.attributes?.map((attribute) => (
                          <AttributeCard
                            key={`${attribute.key}-${attribute.value}`}
                            attribute={attribute}
                            collectionTokenCount={collection?.tokenCount || 0}
                            collectionId={collection?.id}
                          />
                        ))}
                      </Grid>
                    )}
                  </TabsContent>
                </Tabs.Root>
              )}
              {isMounted && (
                <TokenListingsTable token={token} account={account} />
              )}
              {isMounted && (
                <TokenOffersTable
                  token={token}
                  floor={collection?.floorAsk?.price?.amount?.native}
                  isOwner={isOwner}
                  account={account}
                />
              )}
            </>
          )}
        </Flex>
      </Flex>
      <Flex
        justify="center"
        css={{
          maxWidth: 1175,
          pb: 20,
          marginLeft: 'auto',
          marginRight: 'auto',
          px: '$1',
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <Flex align="start" justify="start" css={{ flex: 1, px: '$3' }}>
          <TokenActivityTable
            token={`${collection?.id}:${token?.token?.tokenId}`}
          />
        </Flex>
      </Flex>
    </Layout>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps<{
  id?: string
  collectionId?: string
  ssr: {
    collection: paths['/collections/v5']['get']['responses']['200']['schema']
    tokens: paths['/tokens/v5']['get']['responses']['200']['schema']
  }
}> = async ({ params }) => {
  let collectionId = params?.contract?.toString()
  const id = params?.id?.toString()
  const { reservoirBaseUrl, apiKey } =
    supportedChains.find((chain) => params?.chain === chain.routePrefix) ||
    DefaultChain

  const contract = collectionId ? collectionId?.split(':')[0] : undefined

  let collectionQuery: paths['/collections/v5']['get']['parameters']['query'] =
    {
      contract: contract,
      includeTopBid: true,
      normalizeRoyalties: NORMALIZE_ROYALTIES,
    }

  const headers = {
    headers: {
      'x-api-key': apiKey || '',
    },
  }

  const collectionsPromise = fetcher(
    `${reservoirBaseUrl}/collections/v5`,
    collectionQuery,
    headers
  )

  let tokensQuery: paths['/tokens/v5']['get']['parameters']['query'] = {
    tokens: [`${contract}:${id}`],
    includeAttributes: true,
    includeTopBid: true,
    includeDynamicPricing: true,
    normalizeRoyalties: NORMALIZE_ROYALTIES,
  }

  const tokensPromise = fetcher(
    `${reservoirBaseUrl}/tokens/v5`,
    tokensQuery,
    headers
  )
  const promises = await Promise.allSettled([
    collectionsPromise,
    tokensPromise,
  ]).catch(() => {})
  const collection: Props['ssr']['collection'] =
    promises?.[0].status === 'fulfilled' && promises[0].value.data
      ? (promises[0].value.data as Props['ssr']['collection'])
      : {}
  const tokens: Props['ssr']['tokens'] =
    promises?.[1].status === 'fulfilled' && promises[1].value.data
      ? (promises[1].value.data as Props['ssr']['tokens'])
      : {}

  return {
    props: { collectionId, id, ssr: { collection, tokens } },
    revalidate: 20,
  }
}

export default TokenPage
