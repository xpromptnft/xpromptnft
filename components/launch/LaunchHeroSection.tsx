import { Box, Flex, Text } from '../primitives'
import { FC } from 'react'
import { useTheme } from 'next-themes'
import { useMediaQuery } from 'react-responsive'

const LearnHeroSection: FC = () => {
  const { theme } = useTheme()
  const isMobile = useMediaQuery({ query: '(max-width: 968px)' })

  return (
    <Flex
      as="section"
      css={{
        marginBottom: '$4',
        width: '100%',
        // borderRadius: '20px',
        backgroundPosition: 'center center',
        backgroundImage: `linear-gradient(109.6deg, rgb(0, 0, 0) 11.2%, #01E2CC 91.1%), url('/images/heroSectionBanner.png')`,
        '@xs': {
          display: 'block',
        },
        '@bp1000': {
          display: 'flex',
        },
      }}
    >
      <Flex
        direction="column"
        css={{
          flex: 1,
          '@xs': {
            padding: '64px 24px',
          },
          '@lg': {
            padding: '80px 64px',
          },
        }}
      >
        <Text
          css={{ color: '$whiteA12', lineHeight: 1.2 }}
          style={{
            '@initial': 'h3',
            '@lg': 'h1',
          }}
        >
          Xprompt NFT Launchpad
        </Text>
        <Text
          style={{
            '@initial': 'subtitle2',
            '@lg': 'subtitle1',
          }}
          css={{
            lineHeight: 1.5,
            width: '100%',
            marginTop: '$3',
            '@lg': {
              width: '100%',
            },
            color: '$whiteA12',
          }}
        >
          Deploy your own AI Generated NFT collection with xPropmt NFT’s
          launchpad.
        </Text>
        <Text
          style={{
            '@initial': 'subtitle2',
            '@lg': 'subtitle1',
          }}
          css={{
            lineHeight: 1.5,
            width: '100%',
            '@lg': {
              width: '100%',
            },
            color: '$whiteA12',
          }}
        >
          Manage the collection settings, minting details, metadata, artwork
          generation, and allowlist, all from the xPrompt NFT. ❤️
        </Text>
      </Flex>
      <Box
        css={{
          // backgroundImage: `url(/images/LearnNFT.png)`,
          // backgroundPosition: 'center',
          // backgroundRepeat: 'no-repeat',
          flex: 0.6,
          '@xs': {},
          '@md': {},
        }}
      ></Box>
    </Flex>
  )
}

export default LearnHeroSection
