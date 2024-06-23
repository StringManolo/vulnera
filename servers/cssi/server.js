const express = require('express');
const bodyParser = require('body-parser');
const path = require('path'); // Módulo path para manejar rutas de archivos
const app = express();
const port = 3000;

// Middleware para analizar cuerpos de solicitudes codificados en URL y JSON
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Middleware para establecer la cabecera Content-Security-Policy
app.use((req, res, next) => {
   res.setHeader("Content-Security-Policy", "default-src 'self'; style-src 'self' 'unsafe-inline'; script-src 'none';");
   next();
});

// Middleware para servir la imagen pi.png
app.get('/phishing.png', (req, res) => {
    res.sendFile(path.join(__dirname, 'phishing.png'));
});

// Función de sanitización para evitar la inserción de HTML
function sanitize(input) {
    return input.replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// Servir el formulario y la página vulnerable
app.get('/', (req, res) => {
    const username = req.query.username ? sanitize(req.query.username) : '';
    res.send(`
        <html>
        <head>
            <title>Vulnera - CSS Injection Example</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                }
                #id${username} {
                    color: blue;
                }
            </style>
        </head>
        <body>
            <h1>Profile Page</h1>
            <form method="GET" action="/">
                <label for="username">Enter your username:</label>
                <input type="text" id="username" name="username">
                <button type="submit">Update</button>
            </form>
            <div id="profile">
                <p>Your username: <span id="id${username}">${username}</span></p>
            </div>
        </body>
        </html>
    `);
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});

