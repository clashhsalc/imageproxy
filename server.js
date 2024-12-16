const express = require('express');
const app = express();

// Serve embed-friendly pages
app.get('/embed', (req, res) => {
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
            <meta property="og:url" content="${req.protocol}://${req.get('host')}${req.originalUrl}">
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
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));
