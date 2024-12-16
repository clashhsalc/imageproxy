const fetch = require('node-fetch');
const url = require('url');

module.exports = async function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');

    const { url: imageUrl } = req.query;

    // Check if URL is provided
    if (!imageUrl) {
        return res.status(400).json({ error: 'Missing image URL parameter' });
    }

    // Validate URL
    try {
        new URL(imageUrl);
    } catch (e) {
        return res.status(400).json({ error: 'Invalid URL format' });
    }

    try {
        // Fetch the image
        const response = await fetch(imageUrl);

        if (!response.ok) {
            return res.status(response.status).json({ 
                error: `Failed to fetch image: ${response.statusText}` 
            });
        }

        // Verify content type
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.startsWith('image/')) {
            return res.status(400).json({ 
                error: 'URL does not point to a valid image' 
            });
        }

        // Set response headers
        res.setHeader('Content-Type', contentType);
        res.setHeader('Cache-Control', 'public, max-age=31536000');
        res.setHeader('Content-Security-Policy', "default-src 'none'; img-src 'self'");

        // Stream the response
        await new Promise((resolve, reject) => {
            response.body.pipe(res)
                .on('error', reject)
                .on('finish', resolve);
        });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};