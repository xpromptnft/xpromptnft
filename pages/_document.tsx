import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
} from 'next/document'
import { getCssText } from '../stitches.config'

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  render() {
    const description =
      'Buy and Sell NFTs on L2 at NFTEarth'
    const ogImage = 'https://nftearth.exchange/render-image-1.png'
    return (
      <Html lang="en">
        <Head>
          <meta charSet="utf-8" />
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
          <meta name="keywords" content="nft, ethereum, protocol" />
          <link
            rel="shortcut icon"
            type="image/png"
            href="https://nftearth.exchange/nftearth-icon.png"
          />
          <meta name="description" content={description} />
          <meta name="keywords" content="NFT, Marketplace, Optimism" />
          {/* Twitter */}
          {/* The optimal size is 1200 x 630 (1.91:1 ratio). */}
          <meta name="twitter:image" content={ogImage} />
          <meta name="twitter:card" content="summary_large_image" />
          <meta
            name="twitter:title"
            content="NFTEarth: Buy and Sell NFTs on L2"
          />
          <meta name="twitter:description" content={description} />
          <meta name="twitter:site" content="@NFTEarth_L2" />

          {/* OG - https://ogp.me/ */}
          {/* https://www.opengraph.xyz/ */}
          <meta
            name="og:title"
            content="NFTEarth: Buy and Sell NFTs on L2"
          />
          <meta property="og:type" content="website" />
          <meta property="og:determiner" content="the" />
          <meta property="og:locale" content="en" />
          <meta property="og:description" content={description} />
          {/* The optimal size is 1200 x 630 (1.91:1 ratio). */}
          <meta property="og:image" content={ogImage} />
          <meta property="og:image:type" content="image/png" />
          <meta property="og:image:width" content="1200" />
          <meta property="og:image:height" content="630" />
          <meta property="og:image:alt" content="NFTEarth Exchange Banner" />

          <meta property="nftearth:title" content="NFTEarth Exchange" />
          <meta property="nftearth:icon" content="/nftearth-icon.png" />
          <meta
            property="nftearth:token-url-optimism"
            content="/collection/optimism/${contract}/${tokenId}"
          />
          <meta
            property="nftearth:token-url-arbitrum"
            content="/collection/arbitrum/${contract}/${tokenId}"
          />
          <style
            id="stitches"
            dangerouslySetInnerHTML={{ __html: getCssText() }}
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
