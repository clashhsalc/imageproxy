// Use native fetch (Node.js 18+) or node-fetch if required
import fetch from 'node-fetch'; // If on Node.js 18+, you can use global fetch

export default async function handler(req, res) {
    const { url } = req.query;

    // Check if URL is provided
    if (!url) {
        return res.status(400).send('Missing image URL.');
    }

    try {
        // Fetch the image from the provided URL
        const response = await fetch(url);

        // Check if the fetch was successful
        if (!response.ok) {
            return res.status(response.status).send('Failed to fetch the image.');
        }

        // Get the content type to ensure it's an image
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.startsWith('image')) {
            return res.status(400).send('The URL does not point to a valid image.');
        }

        // Set headers to serve the image
        res.setHeader('Content-Type', contentType);

        // Stream the image to the response
        response.body.on('error', (err) => {
            console.error('Stream error:', err);
            res.status(500).send('Error streaming the image.');
        });

        response.body.pipe(res);
    } catch (error) {
        console.error('Error fetching the image:', error);
        res.status(500).send('Internal Server Error.');
    }
}
