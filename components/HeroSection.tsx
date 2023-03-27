import Link from 'next/link'

import { Button, Flex, Grid, Text } from './primitives'
import { FC } from 'react'
import { useTheme } from 'next-themes'

interface IProp {
  hideLink?: boolean
}

const HeroSection: FC<IProp> = ({ hideLink }) => {
  const { theme } = useTheme()

  return (
    <Flex
      as="section"
      css={{
        width: '100%',
        backgroundPosition: 'center center',
        backgroundImage: `linear-gradient(109.6deg, rgb(0, 0, 0) 11.2%, rgb(4,216,195) 91.1%), url('/images/heroSectionBanner.png')`,
        '@xs': {
          gridTemplateColumns: 'unset',
          padding: '64px 24px',
        },
        '@lg': {
          gridTemplateColumns: 'repeat(2, 1fr)',
          padding: '100px 64px',
        },
      }}
    >
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
            '@initial': 'h2',
            '@lg': 'h1',
          }}
          as="h1"
          css={{ color: '$whiteA12', lineHeight: 1.2 }}
        >
          Eplore AI Generated NFTs{' '}
        </Text>
        <Text
          style="subtitle1"
          css={{
            lineHeight: 1.5,
            color: '$whiteA12',
            width: '100%',
            '@lg': { width: '50%' },
          }}
        >
          {`Explore, Trade and Create NFTs on the Marketplace Built for L2`}
        </Text>
        {hideLink ?? (
          <Flex css={{ gap: 10 }}>
            <Link href="/portfolio" passHref legacyBehavior>
              <Button
                as="a"
                color={theme === 'light' ? 'primary' : 'ghost'}
                corners="pill"
                size="large"
                css={{
                  width: 250,
                  borderRadius: '$lg',
                  justifyContent: 'center',
                  border: '2px solid #01E2CC',
                  '&:hover': {
                    background: '#01E2CC',
                    color: 'black',
                  },
                }}
              >
                Create your own NFT
              </Button>
            </Link>
            <Link href="/explore" passHref legacyBehavior>
              <Button
                as="a"
                color={theme === 'light' ? 'primary' : 'ghost'}
                corners="pill"
                size="large"
                css={{
                  width: 100,
                  borderRadius: '$lg',
                  border: '2px solid #01E2CC',
                  justifyContent: 'center',
                  '&:hover': {
                    background: '#01E2CC',
                    color: 'black',
                  },
                }}
              >
                Explore
              </Button>
            </Link>
          </Flex>
        )}
      </Grid>
    </Flex>
  )
}

export default HeroSection
