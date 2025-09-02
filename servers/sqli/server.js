const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const session = require('express-session');
const app = express();
const port = 3000; 

// Middleware para analizar cuerpos de solicitudes
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Configuración de sesiones
app.use(session({
    secret: 'sql_injection_secret',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

// Configuración de la base de datos SQLite
const db = new sqlite3.Database(':memory:');

// Crear tabla y datos de ejemplo
db.serialize(() => {
    db.run("CREATE TABLE users (id INTEGER PRIMARY KEY, username TEXT, password TEXT, email TEXT)");
    db.run("INSERT INTO users (username, password, email) VALUES ('admin', 'admin123', 'admin@example.com')");
    db.run("INSERT INTO users (username, password, email) VALUES ('john', 'password123', 'john@example.com')");
    db.run("INSERT INTO users (username, password, email) VALUES ('test', 'test123', 'test@example.com')");
    
    db.run("CREATE TABLE products (id INTEGER PRIMARY KEY, name TEXT, price REAL)");
    db.run("INSERT INTO products (name, price) VALUES ('Laptop', 999.99)");
    db.run("INSERT INTO products (name, price) VALUES ('Mouse', 19.99)");
    db.run("INSERT INTO products (name, price) VALUES ('Keyboard', 49.99)");
});

// Ruta principal - Página de inicio con formularios de prueba
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>SQL Injection Lab</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 40px; }
                .container { max-width: 800px; margin: 0 auto; }
                .section { margin-bottom: 30px; padding: 20px; border: 1px solid #ddd; border-radius: 5px; }
                .vulnerable { background-color: #ffe6e6; }
                .secure { background-color: #e6ffe6; }
                input, button { padding: 8px; margin: 5px 0; }
                pre { background-color: #f5f5f5; padding: 15px; overflow: auto; }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>SQLi</h1>
                
                <div class="section vulnerable">
                    <h2>SQLi vuln login</h2>
                    <form action="/login-vulnerable" method="POST">
                        <input type="text" name="username" placeholder="User" required><br>
                        <input type="password" name="password" placeholder="Password" required><br>
                        <button type="submit">Log-In</button>
                    </form>
                    <p>Try with: <code>' OR '1'='1</code> on void user and password</p>
                </div>
                
                <div class="section vulnerable">
                    <h2>Product search (Vulnerable)</h2>
                    <form action="/search-vulnerable" method="GET">
                        <input type="text" name="query" placeholder="Search products" required><br>
                        <button type="submit">Search</button>
                    </form>
                    <p>Try with: <code>' UNION SELECT id, username, password FROM users--</code></p>
                </div>
                
                <div class="section secure">
                    <h2>Secure Login (Protegido)</h2>
                    <form action="/login-secure" method="POST">
                        <input type="text" name="username" placeholder="User" required><br>
                        <input type="password" name="password" placeholder="Password" required><br>
                        <button type="submit">Log-In</button>
                    </form>
                </div>
                
                <div class="section">
                    <h2>Vuln Info</h2>
                    <p>This vuln happens when user input is included without proper sanitization</p>
                    <h3>Example of vulnerable code:</h3>
                    <pre>
const query = "SELECT * FROM users WHERE username = '" + username + "' AND password = '" + password + "'";
db.all(query, (err, rows) => {
  // logic
});
                    </pre>
                    
                    <h3>Example of secure code:</h3>
                    <pre>
const query = "SELECT * FROM users WHERE username = ? AND password = ?";
db.all(query, [username, password], (err, rows) => {
  // logic
});
                    </pre>
                </div>
            </div>
        </body>
        </html>
    `);
});

// Ruta vulnerable a SQL Injection en login
app.post('/login-vulnerable', (req, res) => {
    const { username, password } = req.body;
    
    // VULNERABLE: concatenación directa de parámetros
    const query = "SELECT * FROM users WHERE username = '" + username + "' AND password = '" + password + "'";
    
    console.log('Running vulnerable query:', query);
    
    db.all(query, (err, rows) => {
        if (err) {
            res.status(500).send('Error at query: ' + err.message);
        } else {
            if (rows.length > 0) {
                req.session.user = rows[0];
                res.send(`
                    <h2>Login Successfull</h2>
                    <p>Welcome, ${rows[0].username}!</p>
                    <p>Email: ${rows[0].email}</p>
                    <a href="/">Back</a>
                `);
            } else {
                res.send(`
                    <h2>Wrong credentials</h2>
                    <p>Wrong user or password.</p>
                    <a href="/">Back</a>
                `);
            }
        }
    });
});

// Ruta vulnerable a SQL Injection en búsqueda
app.get('/search-vulnerable', (req, res) => {
    const query = req.query.query;
    
    // VULNERABLE: concatenación directa de parámetros
    const sql = "SELECT * FROM products WHERE name LIKE '%" + query + "%'";
    
    console.log('Running vulnerable query:', sql);
    
    db.all(sql, (err, rows) => {
        if (err) {
            res.status(500).send('Error at query: ' + err.message);
        } else {
            let results = '<h2>Search results</h2>';
            
            if (rows.length > 0) {
                results += '<ul>';
                rows.forEach(row => {
                    results += `<li>${row.name} - $${row.price}</li>`;
                });
                results += '</ul>';
            } else {
                results += '<p>Products not found.</p>';
            }
            
            results += '<a href="/">Back</a>';
            res.send(results);
        }
    });
});

// Ruta segura con consultas preparadas
app.post('/login-secure', (req, res) => {
    const { username, password } = req.body;
    
    // SEGURO: uso de consultas preparadas
    const sql = "SELECT * FROM users WHERE username = ? AND password = ?";
    
    console.log('Running safe query:', sql, [username, password]);
    
    db.all(sql, [username, password], (err, rows) => {
        if (err) {
            res.status(500).send('Error at query: ' + err.message);
        } else {
            if (rows.length > 0) {
                req.session.user = rows[0];
                res.send(`
                    <h2>Login Successfull</h2>
                    <p>Welcome, ${rows[0].username}!</p>
                    <p>Email: ${rows[0].email}</p>
                    <a href="/">Back</a>
                `);
            } else {
                res.send(`
                    <h2>Wrong credentials</h2>
                    <p>Wrong user or password.</p>
                    <a href="/">Back</a>
                `);
            }
        }
    });
});

// Ruta para mostrar información de la base de datos (solo para demostración)
app.get('/debug', (req, res) => {
    db.all("SELECT name FROM sqlite_master WHERE type='table'", (err, tables) => {
        if (err) {
            res.status(500).send('Error: ' + err.message);
        } else {
            let debugInfo = '<h2>Database info</h2>';
            debugInfo += '<h3>Tables:</h3><ul>';
            
            tables.forEach(table => {
                debugInfo += `<li>${table.name}</li>`;
            });
            
            debugInfo += '</ul><a href="/">Back</a>';
            res.send(debugInfo);
        }
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
