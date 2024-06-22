const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

// Middleware para analizar cuerpos de solicitudes codificados en URL y JSON
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Servir el formulario y la página vulnerable
app.get('/', (req, res) => {
    res.send(`
        <html>
        <head>
            <title>Vulnera - DOM XSS Example</title>
        </head>
        <body>
            <h1>Search Page</h1>
            <form id="searchForm">
                <label for="query">Enter your search query:</label>
                <input type="text" id="query" name="query">
                <button type="submit">Search</button>
            </form>
            <div id="results"></div>
            <script>
                // Manejar el envío del formulario para evitar la redirección
                document.getElementById('searchForm').addEventListener('submit', function(event) {
                    event.preventDefault();
                    const query = document.getElementById('query').value;
                    if (query) {
                        // Mostrar el resultado de búsqueda sin sanitización
                        document.getElementById('results').innerHTML = 'You searched for: ' + query;
                    }
                });
            </script>
        </body>
        </html>
    `);
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});

