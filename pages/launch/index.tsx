import {
  useContext,
  ChangeEvent,
  useEffect,
  useState,
  KeyboardEvent,
} from 'react'
import LaunchHeroSection from 'components/launch/LaunchHeroSection'
import Layout from 'components/Layout'
import { useTheme } from 'next-themes'
import { useMediaQuery } from 'react-responsive'
import { useForm } from 'react-hook-form'
import LoadingSpinner from 'components/common/LoadingSpinner'

import * as Accordion from '@radix-ui/react-accordion'
import classNames from 'classnames'
import { ChevronDownIcon } from '@radix-ui/react-icons'
import { collections } from '../../utils/data/collections'
import { NetworkContext, TronWebContext } from '../../pages/_app'
// import { useAuthContext } from '../../hooks/useAuthContext'

// const { chain: activeChain } = useNetwork()
import { Text, Flex, Box, Input, Switch, Button } from 'components/primitives'
import Select from 'react-select'
import {
  FaHatCowboy,
  FaFrog,
  FaRocket,
  FaTrashAlt,
  FaChevronDown,
  FaChevronUp,
  FaDog,
  FaWalking,
  FaDivide,
} from 'react-icons/fa'

import { useUploadToIpfs } from 'hooks/useUploadToIpfs'
import { ethers, BigNumber } from 'ethers'
import { contractAbi, contractAddress } from 'utils/contract'
import { useAccount, useNetwork, useSigner } from 'wagmi'
import { OPENSEA_ASSET_URL } from 'utils/config'
// import { LinkComponent } from './LinkComponent'
import { useCreateImage } from 'hooks/useCreateImage'
import { orangeA } from '@radix-ui/colors/types/dark/orangeA'
import { StyledInput } from 'components/primitives/Input'

interface Props {
  imageUrl: string
  text: string | undefined
}

const customStyles = {
  option: (provided: any, state: any) => ({
    ...provided,
    // borderBottom: '2px solid grey',
    color: state.isSelected ? 'grey' : 'white',
    backgroundColor: '#202425',

    // backgroundColor: state.isSelected ? 'grey' : 'black',
    ':hover': {
      cursor: 'pointer',
      backgroundColor: state.isSelected ? '' : '#3f3f46',
    },
  }),
  input: (provided: any) => ({
    ...provided,
    color: 'white',
  }),
  control: (provided: any) => ({
    ...provided,
    margin: 0,
    backgroundColor: '#202425',
    border: 0,
    outline: 'none',
    // This line disable the blue border
    boxShadow: 'none',
  }),
  singleValue: (provided: any) => ({
    ...provided,
    color: 'white',
    // backgroundColor: 'green',
  }),
  menuList: (provided: any) => ({
    ...provided,
    backgroundColor: '#202425',
    paddingTop: 0,
    paddingBottom: 0,
    border: `1px solid black`,
    // height: '100px',
  }),
  indicatorSeparator: (provided: any) => ({
    ...provided,
    backgroundColor: '#202425',
  }),
}

export const collectionOptions = [
  {
    value: 'the-random-collection',
    label: (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          margin: '5px',
        }}
      >
        <FaWalking /> &nbsp;&nbsp;&nbsp; <span>The Random Collection</span>
      </div>
    ),
  },
  {
    value: 'the-dog-collection',
    label: (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          margin: '5px',
        }}
      >
        <FaDog /> &nbsp;&nbsp;&nbsp; <span>The Dog Collection</span>
      </div>
    ),
  },
  {
    value: 'the-space-collection',
    label: (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          margin: '5px',
        }}
      >
        {' '}
        <FaRocket /> &nbsp;&nbsp;&nbsp; <span>The Space Collection</span>
      </div>
    ),
  },
  {
    value: 'the-walter-white-collection',
    label: (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          margin: '5px',
        }}
      >
        {' '}
        <FaHatCowboy /> &nbsp;&nbsp;&nbsp;{' '}
        <span>The Walter White Collection</span>
      </div>
    ),
  },
]
export const imagesOptions = [
  {
    value: '1',
    label: (
      <div className="p-3 rounded-lg">
        <span>1 image</span>
      </div>
    ),
  },
  {
    value: '4',
    label: (
      <div className="p-3">
        <span>4 images</span>
      </div>
    ),
  },
]

export const modelOptions = [
  {
    value: 'open-ai',
    label: (
      <div className="p-3 rounded-lg">
        <span>Open AI</span>
      </div>
    ),
  },
  {
    value: 'dall-e-2',
    label: (
      <div className="p-3">
        <span>DALL-E 2</span>
      </div>
    ),
  },
  {
    value: 'imagen',
    label: (
      <div className="p-3">
        <span>Imagen</span>
      </div>
    ),
  },
]

const LaunchpadDeployPage = (props: Props) => {
  // for generate images from ai
  const [genText, setGenText] = useState('')
  const [style, setStyle] = useState('')
  const [finalText, setFinalText] = useState('')
  const { loading, data: images } = useCreateImage(finalText)
  const network = useContext(NetworkContext)
  // const { session, isLoading } = useAuthContext()

  async function createImages() {
    setFinalText(genText + ' ' + style)
  }

  //for upload to ipfs and mint
  const { data: signer } = useSigner()
  const { address } = useAccount()
  const { chain } = useNetwork()
  const [mintStatus, setMintStatus] = useState('OPEN')
  const [minted, setMinted] = useState('')

  const { theme } = useTheme()
  const isMobile = useMediaQuery({ query: '(max-width: 960px)' })
  const [chosenIndex, setChosenIndex] = useState(0)
  const [collection, setCollection] = useState('the-random-collection')
  const [model, setModel] = useState('open-ai')
  const [progress, setProgress] = useState(0)
  const [generatedImage, setGeneratedImage] = useState('')
  const [generatedImages, setGeneratedImages] = useState<string[]>([])
  //const [chosenIndex, setChosenIndex] = useState(0)
  const [generatedPrompt, setGeneratedPrompt] = useState('')
  const [generateError, setGenerateError] = useState(false)
  const [nextTokenId, setNextTokenId] = useState('0')
  const [viewRules, setViewRules] = useState(false)
  const [mintingStatus, setMintingStatus] = useState('mint')
  const [nftLink, setNftLink] = useState('https://apenft.io')
  let imageUrl = ''
  const [description, setDescription] = useState('')
  const [getTitle, setTitle] = useState('')
  const [getPrice, setPrice] = useState('0.00')
  const [getname, setName] = useState('')
  const weiValue = ethers.utils.parseEther(getPrice)

  console.log('big converted number ===========>>>>>>>>>>>>>>>>', weiValue)

  // const [bannerImages, setBannerImages] = useState(
  //   collections['shasta']['the-space-collection'].banner
  // )

  // for ipfs upload
  const text = props.text
  const [url, setURL] = useState('')
  const {
    loading: ipfsLoading,
    data: ipfsHash,
    error,
  } = useUploadToIpfs(url, text)

  function getIpfs(cid: string): string {
    return 'https://ipfs.io/ipfs/' + cid
  }
  async function uploadToIPFS() {
    setURL(imageUrl + '&v=' + Math.random())
    console.log('Image url is =====>>>>>>>>>>', imageUrl)
  }

  async function mint() {
    try {
      const tronWeb = useContext(TronWebContext)

      const chosenCollection = collections[network][collection]
      const nftContract = await tronWeb.contract(
        // NFT.abi,
        chosenCollection.address
      )
      const nextTokenID = await nftContract.tokenId().call()

      setNextTokenId(nextTokenID.toString())
    } catch (e) {
      console.log(e)
    }

    const uri = JSON.stringify({
      name: getname,
      description: description,
      image: ipfsHash ? getIpfs(ipfsHash) : imageUrl,
      title: getTitle,
      price: getPrice,
    })
    const tokenURI = 'data:application/json;base64,' + btoa(uri)
    if (!signer) {
      console.log('connect wallet')
      alert('Connect your Wallet')
      return
    }
    if (!chain) return
    const contract = new ethers.Contract(
      contractAddress[chain?.id],
      contractAbi,
      signer
    )
    console.log('chain id --->>>', chain?.id)

    console.log('Contract address  --->>>', contractAddress[chain?.id])
    setMintStatus('MINTING')

    try {
      const mintTx = await contract.mint(tokenURI, address, weiValue)

      setMintStatus('WAITING')
      const txReceipt = await mintTx.wait(2)
      const tokenId = txReceipt.events[0].args.tokenId
      setMintStatus('MINTED')
      setMinted(
        `${OPENSEA_ASSET_URL[chain?.id]}/${
          contractAddress[chain?.id]
        }/${tokenId}`
      )
      alert('NFT is Minted Successfully')
    } catch (e) {
      setMintStatus('OPEN')
      console.log(e)
    }
  }

  const [numberOfImages, setNumberOfImages] = useState<'1' | '4'>('1')
  // const { session, isLoading } = useAuthContext()
  //const [currentNFTModel, setNFTModel] = useState<NftModel>(null)
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    watch,
    formState: { errors },
  } = useForm()

  const handleChangeCollection = (selectedOption: any) => {
    setChosenIndex(0)
    setGeneratedImages([])
    setCollection(selectedOption.value)
    setMintingStatus('mint')
  }

  const modelIdToModelName: { [key: string]: string } = {
    'open-ai': 'Open AI',
    'dall-e-2': 'DALL-E 2',
    imagen: 'Imagen',
  }

  const handleChangeModel = (selectedOption: any) => {
    setModel(selectedOption.value)
  }
  const handleChangeNumberOfImages = (selectedOption: any) => {
    setNumberOfImages(selectedOption.value)
  }

  const [bannerImages, setBannerImages] = useState(
    collections['shasta']['the-space-collection'].banner
  )
  //   const { chain: activeChain } = useNetwork()

  useEffect(() => {
    if (!collection || !network) return
    const getNextId = async () => {
      try {
        const chosenCollection = collections[network][collection]
        const nftContract = await network.contract(
          // NFT.abi,
          chosenCollection.address
        )
        const nextTokenID = await nftContract.tokenId().call()

        setNextTokenId(nextTokenID.toString())
      } catch (e) {
        console.log(e)
      }
    }
    getNextId()
  }, [collection, network])

  useEffect(() => {
    if (!network || !collection) return
    setBannerImages(collections[network][collection].banner)
  }, [network, collection])

  return (
    <Layout>
      <LaunchHeroSection />

      <Flex
        justify="center"
        direction="column"
        css={{
          width: isMobile ? '100%' : '70%',
          borderRadius: 10,
          padding: isMobile ? 8 : 24,
          margin: '0 auto',
        }}
      >
        <br></br>
        <div>
          <Text style="h4" as="h4">
            Choose collection
          </Text>

          <Select
            className="w-full"
            defaultValue={{
              label: collectionOptions[0].label,
              value: collectionOptions[0].value,
            }}
            options={collectionOptions}
            styles={customStyles}
            onChange={handleChangeCollection}
            autoFocus={true}
          />
        </div>
        <br></br>
        <div
          style={{ display: 'flex', alignItems: 'center' }}
          className="w-full px-4 grid items-center justify-between gap-3 grid-rows-1 overflow-y-hidden 
      grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 2xl:grid-cols-8 3xl:grid-cols-9 my-5"
        >
          {[...Array(3)].map((_, i) => (
            <a
              key={i}
              href={bannerImages[i]?.nft}
              target="_blank"
              rel="noreferrer"
              className="cursor-pointer"
            >
              <img
                src={bannerImages[i]?.image}
                alt="generated image"
                className="rounded-xl "
                style={{ borderRadius: '8px', padding: '5px' }}
              ></img>
            </a>
          ))}
          <a
            className="cursor-pointer hidden sm:block"
            href={bannerImages[3]?.nft}
            target="_blank"
            rel="noreferrer"
          >
            <img
              src={bannerImages[3]?.image}
              alt="generated image"
              className="rounded-xl "
              style={{ borderRadius: '8px', padding: '5px' }}
            ></img>
          </a>
          <a
            className="cursor-pointer hidden md:block"
            href={bannerImages[4]?.nft}
            target="_blank"
            rel="noreferrer"
          >
            <img
              src={bannerImages[4]?.image}
              alt="generated image"
              className="rounded-xl "
              style={{ borderRadius: '8px', padding: '5px' }}
            ></img>
          </a>
          <a
            className="cursor-pointer hidden lg:block"
            href={bannerImages[5]?.nft}
            target="_blank"
            rel="noreferrer"
          >
            <img
              src={bannerImages[5]?.image}
              alt="generated image"
              className="rounded-xl "
              style={{ borderRadius: '8px', padding: '5px' }}
            ></img>
          </a>
          <a
            className="cursor-pointer hidden xl:block"
            href={bannerImages[6]?.nft}
            target="_blank"
            rel="noreferrer"
          >
            <img
              src={bannerImages[6]?.image}
              alt="generated image"
              className="rounded-xl "
              style={{ borderRadius: '8px', padding: '5px' }}
            ></img>
          </a>
          <a
            className="cursor-pointer hidden 2xl:block"
            href={bannerImages[0]?.nft}
            target="_blank"
            rel="noreferrer"
          >
            <img
              src={bannerImages[0]?.image}
              alt="generated image"
              className="rounded-xl "
              style={{ borderRadius: '8px', padding: '5px' }}
            ></img>
          </a>
          <a
            className="cursor-pointer hidden 3xl:block"
            href={bannerImages[1]?.nft}
            target="_blank"
            rel="noreferrer"
          >
            <img
              src={bannerImages[1]?.image}
              alt="generated image"
              className="rounded-xl "
              style={{ borderRadius: '8px', padding: '5px' }}
            ></img>
          </a>
        </div>
        <br></br>
        <div className="w-3/4 lg:w-[48rem] flex flex-col gap-4">
          <div style={{ textAlign: 'center' }}>
            <Text style="h4" as="h4">
              {collections[network][collection].name}
            </Text>
            <p className="text-center text-zinc-300 w-full md:w-5/6 text-sm md:text-base">
              A collection of space related images, generated by Stable
              Diffusion and DALL-E 2. Go to https://xpromptnft.xyz to generate
              your own!
            </p>
            {collections[network][collection].rules.length > 0 && (
              <div
                style={{
                  width: '100%',
                  backgroundColor: '#202425',
                  borderRadius: '6px',
                  flexDirection: 'column',
                  display: 'flex',
                  marginTop: '10px',
                }}
                className="flex flex-col gap-2 border-4 border-zinc-800 w-full md:w-5/6 rounded-lg"
              >
                <p
                  onClick={() => setViewRules(!viewRules)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    margin: '10px',
                    cursor: 'pointer',
                  }}
                  className="flex justify-between items-center px-4 py-3 font-semibold cursor-pointer"
                >
                  Collection Rules
                  {viewRules ? <FaChevronDown /> : <FaChevronUp />}
                </p>
                {viewRules && (
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '10px',
                      marginBottom: '10px',
                    }}
                    className="flex flex-col gap-2 py-2 px-5 mb-2"
                  >
                    <p className="text-lg font-semibold">
                      The prompt needs to contain atleast one of the following
                      words:
                    </p>
                    <div
                      style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '10px',
                        marginLeft: '10px',
                      }}
                      className="flex flex-wrap gap-3"
                    >
                      {collections[network][collection].rules.map((word) => (
                        <b>
                          <p
                            key={word}
                            className="py-2 px-4 bg-zinc-800 rounded-lg hover:bg-green-400 hover:text-black cursor-pointer"
                            style={{
                              backgroundColor: '#99D52A',
                              padding: '10px',
                              borderRadius: '8px',
                              color: 'black',
                              textTransform: 'capitalize',
                            }}
                          >
                            {word}
                          </p>
                        </b>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
            <br />
          </div>
          <div>
            <div style={{ display: 'flex' }}>
              <div style={{ flexGrow: '7' }}>
                <Select
                  defaultValue={{
                    label: modelOptions[0].label,
                    value: modelOptions[0].value,
                  }}
                  options={modelOptions}
                  styles={customStyles}
                  onChange={handleChangeModel}
                />
              </div>
              &nbsp;&nbsp;
              <div style={{ flexGrow: '2' }}>
                <Select
                  defaultValue={{
                    label: imagesOptions[0].label,
                    value: imagesOptions[0].value,
                  }}
                  options={imagesOptions}
                  styles={customStyles}
                  onChange={handleChangeNumberOfImages}
                />
              </div>
            </div>

            {model !== 'open-ai' && (
              <p className="px-2 py-2 text-red-400">
                Unfortunately, we don&apos;t support {modelIdToModelName[model]}{' '}
                at the moment.
              </p>
            )}
          </div>
          <br></br>
          {/* <form onSubmit={handleSubmit(onSubmit)}> */}

          <div style={{ display: 'flex' }}>
            <div style={{ flexGrow: '12' }}>
              <Input
                placeholder="Enter your prompt..."
                {...register('prompt', { required: true })}
                //   style={{ width: '' }}
                onChange={(e) => setGenText(e.target.value)}
                style={{ marginRight: '10px' }}
              />
            </div>
            <div style={{ flexGrow: '0' }}>
              <Button
                style={{
                  backgroundColor: '#01E2CC',
                }}
                onClick={createImages}
                className="button"
              >
                Generate
              </Button>
            </div>
          </div>
          {errors.prompt && (
            <span className="px-2 text-red-400">This field is required</span>
          )}
          {errors.rules && (
            <span className="px-2 text-red-400">
              Prompt does not follow to the collection rules
            </span>
          )}

          <br></br>
          <br></br>

          <div
            style={{ display: 'flex' }}
            className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-12 mt-3"
          >
            <div
              style={{ flexGrow: '8', alignItems: 'center' }}
              className="flex flex-col gap-4"
            >
              <div
                style={{
                  height: '512px',
                  width: '512px',
                  backgroundColor: 'gray',
                  borderRadius: '10px',
                  marginBottom: '40px',
                  marginRight: '100px',
                  alignItems: 'center',
                }}
              >
                <div
                  className="h-64 md:h-80 bg-zinc-800 rounded-lg"
                  style={{
                    width: Math.floor(progress) + '%',

                    backgroundColor: 'gray',
                  }}
                ></div>
                {images?.data && (
                  <div>
                    {images.data.map((image) => (
                      <div>
                        <img
                          src={(imageUrl = String(image.url))}
                          key={'image' + image.url}
                          alt={text}
                          style={{
                            height: '512px',
                            width: '512px',
                            backgroundColor: 'gray',
                            borderRadius: '10px',
                            marginBottom: '40px',
                            marginRight: '100px',
                            alignItems: 'center',
                          }}
                        />
                        {/* {console.log(image)} */}
                        {/* {(imageUrl = String(image.url))} */}
                        {/* imageUrl=String(image.url) text=text key='mint' +
                        image.url */}
                      </div>
                    ))}
                  </div>
                )}
                {loading && (
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: '512px',
                    }}
                  >
                    <LoadingSpinner />
                  </div>
                )}
              </div>

              <div
                style={{ display: 'flex', flexDirection: 'column' }}
                className="grid grid-cols-2 gap-4 font-semibold"
              >
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                  <p>
                    <b>Model </b> : OpenAI
                  </p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                  <p>
                    <b>Creator </b> : {signer?.getAddress}
                    {/* {session ? session?.user.name : '0x0'} */}
                  </p>
                </div>
              </div>
            </div>

            <div
              style={{ flexGrow: '0', width: '512px' }}
              className="flex flex-col gap-2"
            >
              <Text style={'h5'} className="text-2xl font-semibold mt-5">
                {collections[network][collection].name}
              </Text>
              <br />
              <p className="text-lg">{watch('prompt')}</p>
              <br />
              <p className="text-xl font-semibold mt-2">Collection</p>
              <br />
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '5' }}
                className="flex items-center gap-5"
              >
                <img
                  src={collections[network][collection].image}
                  alt="generated image"
                  className="h-12 w-12 rounded-md"
                  style={{
                    marginRight: '20px',
                    borderRadius: '10px',
                    height: 64,
                    width: 64,
                  }}
                ></img>
                <p>{collections[network][collection].name}</p>
              </div>
              <br />
              <Text style={'h5'}>Details</Text>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div
                  style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <p className="font-semibold text-lg">Minted : </p>
                  <p className="text-lg text-gray-400">
                    {mintingStatus === 'minted'
                      ? new Date().toISOString().split('T')[0]
                      : 'Not minted yet'}
                  </p>
                </div>
                <div
                  style={{ display: 'flex', justifyContent: 'space-between' }}
                  className="flex items-center justify-between"
                >
                  <p className="font-semibold text-lg">Owned by : </p>
                  <p className="text-lg text-gray-400">
                    {mintingStatus === 'minted' ? 'You' : 'No one'}
                  </p>
                </div>
                <br></br>
                {/* <Input
                  placeholder="0.00"
                  // disabled={mintStatus !== 'OPEN'}
                  value={getPrice}
                  onChange={(e) => setPrice(e.target.value)}
                  css={{ color: 'white' }}
                /> */}
                NFT Price:
                <StyledInput
                  required
                  value={getPrice}
                  placeholder="0"
                  onKeyDown={(e: KeyboardEvent<HTMLInputElement>) =>
                    ['e', '+', '-'].includes(e.key) && e.preventDefault()
                  }
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setPrice(e.target.value)
                  }
                  css={{
                    backgroundColor: theme === 'light' ? '$gray1' : 'initial',
                    marginTop: 6,
                    marginBottom: 10,
                    width: '100%',
                    border: '1px solid #01E2CC',
                    borderRadius: 6,
                    pr: 32,
                    boxSizing: 'border-box',
                  }}
                />
                {/* <div className="flex items-center justify-between">
                  <p className="font-semibold text-lg">Network</p>
                  <p className="text-lg text-gray-400">
                    {network === 'mainnet' ? 'Tron mainnet' : 'Shasta testnet'}
                  </p>
                </div> */}
              </div>

              {imageUrl ? (
                <Button
                  style={{
                    // width: '100%',
                    marginRight: '10px',
                    backgroundColor: '#01E2CC',
                  }}
                  //Disabled={Boolean(ipfsHash && ipfsHash?.length > 0)}
                  // isLoading={ ipfsLoading }

                  onClick={uploadToIPFS}
                >
                  {ipfsLoading ? (
                    <LoadingSpinner
                      css={{
                        width: 20,
                        height: 20,
                        border: '5px solid transparent',
                        borderBottomColor: 'black',
                        borderRightColor: 'transparent',
                        borderRadius: '50%',
                        display: 'inline-block',
                        // animation: `${spin} 1s cubic-bezier(0.76, 0.35, 0.2, 0.7) infinite`,
                        //...css,
                      }}
                    ></LoadingSpinner>
                  ) : null}

                  {ipfsHash ? '✓ Uploaded To IPFS' : 'Upload Image To IPFS'}
                </Button>
              ) : (
                <Button
                  disabled
                  style={{
                    backgroundColor: 'gray',
                    marginRight: '10px',
                  }}
                >
                  Generate Image First
                </Button>
              )}

              {imageUrl ? (
                <Button disabled={mintStatus !== 'OPEN'} onClick={mint}>
                  {mintStatus === 'MINTED' ? 'Minted' : 'MINT'}
                </Button>
              ) : (
                <Button disabled onClick={mint}>
                  {mintStatus === 'MINTED' ? 'Minted' : 'MINT'}
                </Button>
              )}
            </div>
          </div>
        </div>
      </Flex>
    </Layout>
  )
}

export default LaunchpadDeployPage
