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
    const response = await fetch(imageUrl, { redirect: 'follow' })
    if (!response.ok) {
      return res.status(response.status).json({ error: response.statusText })
    }

    const contentType = response.headers.get('content-type')
    if (!contentType?.startsWith('image/')) {
      return res.status(400).json({ error: 'Not an image' })
    }

    res.setHeader('Content-Type', contentType)
    res.setHeader('Cache-Control', 'public, max-age=86400')
    if (!response.body) {
      return res.status(500).json({ error: 'No response body' })
    }
    await response.body.pipeTo(new WritableStream({
      write(chunk) {
        res.write(chunk)
      },
    }))
    res.end()
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' })
  }
}