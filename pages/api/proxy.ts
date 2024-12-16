import type { NextApiRequest, NextApiResponse } from 'next'

export const config = {
  api: {
    responseLimit: false,
    bodyParser: false,
  },
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const imageUrl = req.query.url as string
  if (!imageUrl) {
    return res.status(400).json({ error: 'URL parameter required' })
  }

  try {
    console.log('Fetching:', imageUrl)
    const response = await fetch(imageUrl, {
      redirect: 'follow',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    })

    console.log('Status:', response.status)

    if (!response.ok) {
      return res.status(response.status).json({ 
        error: response.statusText,
        details: `Failed to fetch from ${response.url}`,
        status: response.status
      })
    }

    const contentType = response.headers.get('content-type')
    console.log('Content-Type:', contentType)

    if (!contentType?.startsWith('image/')) {
      return res.status(400).json({ 
        error: 'Not an image',
        actualType: contentType,
        url: response.url
      })
    }

    res.setHeader('Content-Type', contentType)
    res.setHeader('Cache-Control', 'public, max-age=86400')
    if (!response.body) {
      throw new Error('No response body')
    }
    
    return response.body.pipeTo(
      new WritableStream({
        write(chunk) {
          res.write(chunk);
        },
        close() {
          res.end();
        },
      })
    );
  } catch (error) {
    console.error('Proxy error:', error)
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : String(error)
    })
  }
}