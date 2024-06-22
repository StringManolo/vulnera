const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

// Middleware to parse JSON and URL encoded bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Endpoint to serve the login page form (GET request)
app.get('/', (req, res) => {
    const loginForm = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Login</title>
        </head>
        <body>
            <h2>Login</h2>
            <form action="/login" method="GET">
                <label for="user">User:</label><br>
                <input type="text" id="user" name="user" required><br><br>
                
                <label for="password">Password:</label><br>
                <input type="password" id="password" name="password" required><br><br>
                
                <button type="submit">Login</button>
            </form>
        </body>
        </html>
    `;
    
    res.send(loginForm);
});

// Endpoint to process the login form (GET request)
app.get('/login', (req, res) => {
    let user = req.query.user;
    let password = req.query.password;

    console.log(`
User: ${user} (data type - ${typeof user})
Password: ${password} (data type - ${typeof password})
    `);

    // Security check
    if (user && password && typeof user === 'string' && typeof password === 'string') {
        if (user !== 'admin' || password !== '1234') {
            res.send('Incorrect credentials');
            return;
        } else {
            // Successful login as admin
        }
    }

    // If security conditions are met, send success message
    res.send('Login successful!'); // This could be sensitive information
});

const PORT = 3000;
app.listen(PORT, '127.0.0.1', () => {
    console.log(`Server listening at http://127.0.0.1:${PORT}`);
});

