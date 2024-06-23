const express = require('express');
const fs = require('fs');
const path = require('path');
const npmFetch = require('npm-registry-fetch');

const app = express();
const app2 = express(); 
const PORT = 3000;
const PORT2 = 3080; 

app.get('/', async (req, res) => {
    let moduleUrl = req.query.moduleUrl;

    if (!moduleUrl) {
        const htmlForm = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Load Module</title>
            </head>
            <body>
                <h2>Load Module</h2>
                <form action="/" method="GET">
                    <label for="moduleUrl">Enter module npm url or local file path:</label>
                    <input type="text" id="moduleUrl" name="moduleUrl" value="https://www.npmjs.com/package/simpleargumentsparser" required>
                    <button type="submit">Load Module</button>
                </form>
            </body>
            </html>
        `;
        return res.send(htmlForm);
    }

    try {
        // Check if moduleUrl is a valid npm URL
        if (moduleUrl.startsWith('http://') || moduleUrl.startsWith('https://')) {
            // Download the module from npm registry
            const response = await npmFetch(moduleUrl);
            const moduleContent = await response.buffer();

            // Display the module content as text
            res.send(`[SERVER] Loaded module from npm (${moduleUrl}):\n\n${moduleContent.toString()}`);
        } else {
            // Validate moduleUrl to prevent directory traversal
            if (!moduleUrl.includes('../') && !moduleUrl.includes('..\\')) {
                // Construct absolute path to the module
                const moduleAbsolutePath = path.resolve(__dirname, moduleUrl);

                // Check if the file exists
                if (fs.existsSync(moduleAbsolutePath)) {
                    // Read the content of the file
                    const moduleContent = fs.readFileSync(moduleAbsolutePath, 'utf-8');

                    // Display the module content as text
                    res.send(`[SERVER] Loaded module from local file (${moduleUrl}):\n\n${moduleContent}`);
                } else {
                    throw new Error('File does not exist.');
                }
            } else {
                throw new Error('Invalid module path.');
            }
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Error loading the module.');
    }
});

// Start listening for requests on PORT
app.listen(PORT, () => {
    console.log(`Main server started at http://localhost:${PORT}`);
});

// Second server route for serving current directory
app2.use(express.static(path.join(__dirname, './')));
app2.listen(PORT2, '127.0.0.1', () => {
    console.log(`Server for current directory started at http://127.0.0.1:${PORT2}`);
});

