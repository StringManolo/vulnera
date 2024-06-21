const express = require('express');
const app = express();
const port = 3000;

// Middleware to parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Serve the login form
app.get('/', (req, res) => {
    res.send(`
        <html>
        <head>
            <title>Vulnera - HTML Injection Example</title>
            <!-- Disable inline JavaScript -->
            <meta http-equiv="Content-Security-Policy" content="script-src 'none';">
        </head>
        <body>
            <h1>Login</h1>
            <form method="POST" action="/login">
                <label for="username">Username:</label>
                <input type="text" id="username" name="username">
                <br>
                <label for="password">Password:</label>
                <input type="password" id="password" name="password">
                <br>
                <button type="submit">Login</button>
            </form>
        </body>
        </html>
    `);
});

// Handle login submission
app.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Simulate login validation (accept any password)
    // Allow HTML Injection but prevent JavaScript execution
    res.send(`
        <html>
        <head>
            <title>Vulnera - HTML Injection Example</title>
            <!-- Disable inline JavaScript -->
            <meta http-equiv="Content-Security-Policy" content="script-src 'none';">
        </head>
        <body>
            <h1>Welcome, ${username}!</h1>
            <p>Login successful. Feel free to explore the content.</p>
        </body>
        </html>
    `);
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});

