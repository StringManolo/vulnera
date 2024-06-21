const express = require('express');
const app = express();
const port = 3000;

// Middleware to parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Serve the form
app.get('/', (req, res) => {
    res.send(`
        <html>
        <head>
            <title>Vulnera - Reflected XSS Example</title>
        </head>
        <body>
            <h1>Search</h1>
            <form method="GET" action="/search">
                <label for="query">Enter your search query:</label>
                <input type="text" id="query" name="query">
                <button type="submit">Search</button>
            </form>
        </body>
        </html>
    `);
});

// Handle search query
app.get('/search', (req, res) => {
    const query = req.query.query;
    // Reflect the search query back to the user without sanitization
    res.send(`
        <html>
        <head>
            <title>Search Results</title>
        </head>
        <body>
            <h1>Search Results for: ${query}</h1>
        </body>
        </html>
    `);
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});

