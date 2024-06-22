const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Serve static files from the 'public' directory (not needed if you're hardcoding HTML)
app.use(express.static(path.join(__dirname, 'public')));

// Route to display file content as text in the browser
app.get('/', (req, res) => {
    const fileName = req.query.file;

    // If fileName is not provided, display the HTML form
    if (!fileName) {
        const htmlForm = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>View File</title>
            </head>
            <body>
                <h2>View File</h2>
                <form action="/" method="GET">
                    <label for="fileName">Enter file name:</label>
                    <input placeholder="hello_world.txt" type="text" id="fileName" name="file" required>
                    <button type="submit">View File</button>
                </form>
            </body>
            </html>
        `;
        return res.send(htmlForm);
    }

    const filePath = `${__dirname}/public_files/${fileName}`;
    
  // Read the file securely
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error reading the file.');
        }
        
        // Set headers to display the file as text in the browser
        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        res.send(data);
    });
});

app.listen(PORT, () => {
    console.log(`Server started at http://localhost:${PORT}`);
});

