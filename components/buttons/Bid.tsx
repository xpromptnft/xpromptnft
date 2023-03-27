import { BidModal, BidStep } from '@nftearth/reservoir-kit-ui'
import { Button } from 'components/primitives'
import {
  cloneElement,
  ComponentProps,
  ComponentPropsWithoutRef,
  FC,
  useContext,
} from 'react'
import { CSS } from '@stitches/react'
import { SWRResponse } from 'swr'
import { useAccount, useNetwork, useSigner, useSwitchNetwork } from 'wagmi'
import { useModal } from 'connectkit'
import { ToastContext } from 'context/ToastContextProvider'
import { useMarketplaceChain } from 'hooks'
import { useTheme } from 'next-themes'

type Props = {
  tokenId?: string | undefined
  collectionId?: string | undefined
  disabled?: boolean
  openState?: [boolean, React.Dispatch<React.SetStateAction<boolean>>]
  buttonCss?: CSS
  buttonProps?: ComponentProps<typeof Button>
  mutate?: SWRResponse['mutate']
}

const Bid: FC<Props> = ({
  tokenId,
  collectionId,
  disabled,
  openState,
  buttonProps,
  mutate,
}) => {
  const { isDisconnected } = useAccount()
  const { setOpen } = useModal()
  const { addToast } = useContext(ToastContext)
  const marketplaceChain = useMarketplaceChain()
  const { switchNetworkAsync } = useSwitchNetwork({
    chainId: marketplaceChain.id,
  })
  const { theme } = useTheme()
  const { data: signer } = useSigner()
  const { chain: activeChain } = useNetwork()

  const isInTheWrongNetwork = Boolean(
    signer && marketplaceChain.id !== activeChain?.id
  )

  const buttonCss: ComponentPropsWithoutRef<typeof Button>['css'] = {
    width: '100%',
    justifyContent: 'center',
    background: theme === 'light' ? '$primary12' : 'none',
    minWidth: 'max-content',
    border: theme === 'light' ? 'none' : '1px solid $primary12',
    '@sm': {
      maxWidth: '200px',
    },
  }

  const trigger = (
    <Button css={buttonCss} disabled={disabled} {...buttonProps} color="gray3">
      Make Offer
    </Button>
  )

  if (isDisconnected || isInTheWrongNetwork) {
    return cloneElement(trigger, {
      onClick: async () => {
        if (switchNetworkAsync && activeChain) {
          const chain = await switchNetworkAsync(marketplaceChain.id)
          if (chain.id !== marketplaceChain.id) {
            return false
          }
        }

        if (!signer) {
          setOpen(true)
        }
      },
    })
  } else
    return (
      <BidModal
        tokenId={tokenId}
        collectionId={collectionId}
        trigger={trigger}
        openState={openState}
        onClose={(data, stepData, currentStep) => {
          if (mutate && currentStep == BidStep.Complete) mutate()
        }}
        onBidError={(error) => {
          if (error) {
            if (
              (error as any).cause.code &&
              (error as any).cause.code === 4001
            ) {
              addToast?.({
                title: 'User canceled transaction',
                description: 'You have canceled the transaction.',
              })
              return
            }
          }
          addToast?.({
            title: 'Could not place bid',
            description: 'The transaction was not completed.',
          })
        }}
      />
    )
}

export default Bid
