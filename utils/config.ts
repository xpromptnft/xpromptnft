import {
  // goerli,
  // sepolia,
  // polygon,
  // optimism,
  // arbitrum,
  // polygonMumbai,
  fantom,
  // fantomTestnet,
} from '@wagmi/chains'
// import { fantomTestnet } from 'wagmi/dist/chains'
// import { fantom } from 'wagmi/dist/chains'

type StyleOption = {
  value: string
  label: string
}

export const STYLE_OPTIONS: StyleOption[] = [
  { value: 'realistic', label: 'Realistic' },
  { value: 'digital art', label: 'Digital Art' },
  { value: '3d render', label: '3D Render' },
  { value: 'pixel art', label: 'Pixel Art' },
  { value: 'black and white', label: 'Black and White' },
  { value: 'abstract', label: 'Abstract' },
  { value: 'cartoon', label: 'Cartoon' },
  { value: 'surreal', label: 'Surreal' },
  { value: 'fantasy', label: 'Fantasy' },
  { value: 'minimalist', label: 'Minimalist' },
  { value: 'pop-art', label: 'Pop Art' },
  { value: 'impressionist', label: 'Impressionist' },
  { value: 'expressionist', label: 'Expressionist' },
  { value: 'cubist', label: 'Cubist' },
  { value: 'futuristic', label: 'Futuristic' },
  { value: 'vintage', label: 'Vintage' },
  { value: 'gothic', label: 'Gothic' },
  { value: 'steampunk', label: 'Steampunk' },
  { value: 'cyberpunk', label: 'Cyberpunk' },
  { value: 'romantic', label: 'Romantic' },
  { value: 'naturalistic', label: 'Naturalistic' },
  { value: 'whimsical', label: 'Whimsical' },
  { value: 'geometric', label: 'Geometric' },
  { value: 'retro', label: 'Retro' },
]

export const SITE_NAME = 'Dream NFT'
export const SITE_NAME_MOBILE = 'Dream NFT'
export const COPYRIGHT = 'Developed with ❤️ for AI'
export const SITE_DESCRIPTION =
  'A Decentralized Application (DApp) that utilizes Natural Language Processing (NLP) to generate images from text input, and then mints the generated image as an ERC721 token on the blockchain.'
export const SITE_URL = 'https://nexth.vercel.app'

export const THEME_INITIAL_COLOR = 'dark'
export const THEME_CONFIG = {
  initialColorMode: THEME_INITIAL_COLOR,
}

export const NO_GENERATED_IMAGES = 1

export const SOCIAL_TWITTER = '#'
export const SOCIAL_GITHUB = '#'

export const ETH_CHAINS = [fantom]

interface OPENSEA_ASSET_URLs {
  [index: number]: string
}

export const OPENSEA_ASSET_URL: OPENSEA_ASSET_URLs = {
  5: 'https://testnets.opensea.io/assets/goerli',
  80001: 'https://testnets.opensea.io/assets/mumbai',
  137: 'https://opensea.io/assets/matic',
  42161: 'https://opensea.io/assets/arbitrum',
  10: 'https://opensea.io/assets/optimism',
  11155111: 'https://testnets.opensea.io/assets/sepolia',
}

export const SERVER_SESSION_SETTINGS = {
  cookieName: SITE_NAME,
  password:
    process.env.SESSION_PASSWORD ??
    'UPDATE_TO_complex_password_at_least_32_characters_long',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
}
