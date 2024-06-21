const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const path = require('path'); // Módulo 'path' de Node.js para manejo de rutas
const app = express();
const port = 3000;

// Middleware para analizar cuerpos de solicitudes codificados en URL y JSON
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Ruta al archivo donde se guardarán los mensajes (relativa a server.js)
const messagesFile = path.join(__dirname, 'messages.json');

// Función para leer los mensajes desde el archivo
function readMessagesFromFile() {
    try {
        if (fs.existsSync(messagesFile)) {
            const data = fs.readFileSync(messagesFile, 'utf8');
            return JSON.parse(data);
        } else {
            return [];
        }
    } catch (err) {
        console.error('Error reading messages from file:', err);
        return [];
    }
}

// Función para guardar los mensajes en el archivo
function saveMessagesToFile(messages) {
    try {
        const data = JSON.stringify(messages, null, 2);
        fs.writeFileSync(messagesFile, data);
    } catch (err) {
        console.error('Error saving messages to file:', err);
    }
}

// Servir el formulario y mostrar mensajes
app.get('/', (req, res) => {
    const messages = readMessagesFromFile();
    let messageList = messages.map(msg => `<p>${msg}</p>`).join('');
    res.send(`
        <html>
        <head>
            <title>Vulnera - Stored XSS Example</title>
        </head>
        <body>
            <h1>Message Board</h1>
            <form method="POST" action="/post-message">
                <label for="message">Enter your message:</label>
                <input type="text" id="message" name="message">
                <button type="submit">Post</button>
            </form>
            <h2>Messages:</h2>
            ${messageList}
            <form method="POST" action="/delete-messages">
                <button type="submit">DELETE SERVER MESSAGES</button>
            </form>
        </body>
        </html>
    `);
});

// Manejar el envío de mensajes
app.post('/post-message', (req, res) => {
    const messageContent = req.body.message;
    const messages = readMessagesFromFile();
    messages.push(messageContent);
    saveMessagesToFile(messages);
    res.redirect('/');
});

// Manejar el borrado de todos los mensajes
app.post('/delete-messages', (req, res) => {
    try {
        fs.unlinkSync(messagesFile);
    } catch (err) {
        console.error('Error deleting messages file:', err);
    }
    res.redirect('/');
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});

