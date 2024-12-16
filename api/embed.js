import fetch from 'node-fetch'; // Vercel supports node-fetch by default

export default async function handler(req, res) {
    const { url } = req.query;

    if (!url) {
        return res.status(400).send('Missing image URL');
    }

    try {
        // Fetch the image from the given URL
        const response = await fetch(url);

        if (!response.ok) {
            return res.status(400).send('Unable to fetch the image.');
        }

        // Get the image's content type
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.startsWith('image')) {
            return res.status(400).send('The URL does not point to an image.');
        }

        // Set the appropriate content headers and stream the image
        res.setHeader('Content-Type', contentType);
        response.body.pipe(res);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching the image.');
    }
}
