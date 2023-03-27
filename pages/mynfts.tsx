import HeroSection from 'components/HeroSection'
import Layout from 'components/Layout'

import { Box, Text, Flex, Anchor, Button, Grid } from 'components/primitives'
import React from 'react'
import { useMediaQuery } from 'react-responsive'
import { MyNFTcard } from 'components/MyNFTcard'

const MyNFTsPage = () => {
  // your page logic goes here
  const isMobile = useMediaQuery({ query: '(max-width: 1300px)' })

  return (
    <div>
      <Layout>
        <HeroSection />
        <Flex
          justify="center"
          css={{
            width: isMobile ? '100%' : '80%',
            borderRadius: 10,
            padding: isMobile ? 8 : 24,
            margin: '0 auto',
          }}
        >
          <MyNFTcard></MyNFTcard>
        </Flex>
      </Layout>
    </div>
  )
}

export default MyNFTsPage
