import type { NextApiRequest, NextApiResponse } from 'next'

export const config = {
  api: {
    responseLimit: false,
  },
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const imageUrl = req.query.url as string
  if (!imageUrl) {
    return res.status(400).json({ error: 'URL parameter required' })
  }

  try {
    const response = await fetch(imageUrl)
    if (!response.ok) {
      return res.status(response.status).json({ error: response.statusText })
    }

    const contentType = response.headers.get('content-type')
    if (!contentType?.startsWith('image/')) {
      return res.status(400).json({ error: 'Not an image' })
    }

    res.setHeader('Content-Type', contentType)
    res.setHeader('Cache-Control', 'public, max-age=86400')
    res.setHeader('Access-Control-Allow-Origin', '*')

    const data = await response.arrayBuffer()
    res.send(Buffer.from(data))
  } catch (error) {
    console.error('Error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}