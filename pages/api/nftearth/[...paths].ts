import { setParams } from '@nftearth/reservoir-sdk'
import type { NextApiRequest, NextApiResponse } from 'next'
import supportedChains, { DefaultChain } from 'utils/chains'

// A proxy API endpoint to redirect all requests to `/api/reservoir/*` to
// MAINNET: https://api.reservoir.tools/{endpoint}/{query-string}
// RINKEBY: https://api-rinkeby.reservoir.tools/{endpoint}/{query-string}
// and attach the `x-api-key` header to the request. This way the
// Reservoir API key is not exposed to the client.

// https://nextjs.org/docs/api-routes/dynamic-api-routes#catch-all-api-routes
const proxy = async (req: NextApiRequest, res: NextApiResponse) => {
  const { query, body, method, headers: reqHeaders } = req
  const { paths } = query
  // Isolate the query object
  delete query.paths

  let endpoint: string = ''

  // convert the slug array into a path string: [a, b] -> 'a/b'
  if (typeof paths === 'string') {
    endpoint = paths
  } else {
    endpoint = (paths || ['']).join('/')
  }

  const chainPrefix = endpoint.split('/')[0]
  const chain =
    supportedChains.find((chain) => chain.routePrefix === chainPrefix) ||
    DefaultChain

  const url = new URL(endpoint.replace(chainPrefix, ''), chain.reservoirBaseUrl)
  setParams(url, query)

  if (endpoint.includes('/tokens/v5') && query?.tokens) {
    const tokens = query?.tokens || '';

    if (Array.isArray(tokens)) {
      for (const t of tokens) {
        const [contract, tokenId] = t.split(':');
        if (contract && tokenId) {
          await res.revalidate(`/collection/${chain.routePrefix}/${contract}/${tokenId}`).catch(e => {
            //empty
          });
        }
      }
    } else {
      const [contract, tokenId] = tokens.split(':');
      if (contract && tokenId) {
        await res.revalidate(`/collection/${chain.routePrefix}/${contract}/${tokenId}`).catch(e => {
          //empty
        });
      }
    }
  }

  if (endpoint.includes('redirect/')) {
    if (endpoint.includes('/currency')) {
      const paths = url.href.split('/');
      res.redirect(`/icons/currency/${paths[paths.length -3].toLowerCase()}.png`);
      return;
    }


    res.redirect(url.href)
    return
  }

  try {
    const options: RequestInit | undefined = {
      method,
    }

    const headers = new Headers()

    if (chain.apiKey) headers.set('x-api-key', chain.apiKey)

    if (typeof body === 'object') {
      headers.set('Content-Type', 'application/json')
      options.body = JSON.stringify(body)
    }

    if (
      reqHeaders['x-rkc-version'] &&
      typeof reqHeaders['x-rkc-version'] === 'string'
    ) {
      headers.set('x-rkc-version', reqHeaders['x-rkc-version'])
    }

    if (
      reqHeaders['x-rkui-version'] &&
      typeof reqHeaders['x-rkui-version'] === 'string'
    ) {
      headers.set('x-rkui-version', reqHeaders['x-rkui-version'])
    }

    options.headers = headers

    const response = await fetch(url.href, options)

    let data: any

    const contentType = response.headers.get('content-type')

    if (contentType?.includes('application/json')) {
      data = await response.json()
    } else {
      data = await response.text()
    }

    if (!response.ok) throw data

    if (contentType?.includes('image/')) {
      res.setHeader('Content-Type', 'text/html')
      res.status(200).send(Buffer.from(data))
    } else {
      res.status(200).json(data)
    }
  } catch (error) {
    res.status(400).json(error)
  }
}

export const config = {
  api: {
    responseLimit: false,
  },
}

export default proxy
