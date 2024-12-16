export default function handler(req, res) {
    const { url } = req.query;

    if (!url) {
        return res.status(400).send('Missing image URL');
    }

    res.setHeader('Content-Type', 'text/html');
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta property="og:type" content="website">
            <meta property="og:title" content="Embedded Image">
            <meta property="og:image" content="${url}">
            <meta property="og:url" content="${req.headers.host}${req.url}">
            <meta property="og:description" content="Shareable embedded image link">
            <meta name="twitter:card" content="summary_large_image">
            <title>Image Embed</title>
        </head>
        <body>
            <h1>Embedded Image</h1>
            <img src="${url}" alt="Embedded Image" style="max-width: 100%;">
        </body>
        </html>
    `);
}
