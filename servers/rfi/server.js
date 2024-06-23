const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const https = require('https');

app.use(express.static(path.join(__dirname, 'public')));

// Ruta para leer archivos locales
app.get('/local', (req, res) => {
    const filename = req.query.file;
    if (!filename) {
        return res.status(400).send('File parameter is required');
    }

    const filePath = path.join(__dirname, 'public', filename);
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error reading file');
        }
        res.send(data);
    });
});

// Ruta para leer archivos remotos (RFI)
app.get('/include', (req, res) => {
    const page = req.query.page;
    if (!page) {
        return res.status(400).send('Page parameter is required');
    }

    // Validación mínima para verificar que la URL sea válida
    if (!isValidUrl(page)) {
        // use /local instead
        return res.redirect('/local?file=' + page);
        //return res.status(400).send('Invalid URL format');
    }

    // Lectura del archivo desde una URL remota (RFI)
    https.get(page, (response) => {
        let data = '';
        response.on('data', (chunk) => {
            data += chunk;
        });
        response.on('end', () => {
            res.send(data);
        });
    }).on('error', (err) => {
        console.error(err);
        res.status(500).send('Error reading file');
    });
});

function isValidUrl(url) {
    try {
        new URL(url);
        return true;
    } catch (error) {
        return false;
    }
}


app.get("/login", (req, res) => {
    const username = req.query.username;

    res.send(`Welcome, ${username}!`);

});


app.listen(3000, () => {
    console.log('Server running on port 3000');
});

