const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const session = require('express-session');
const app = express();
const port = 3000;

// Middleware para analizar cuerpos de solicitudes codificados en URL y JSON
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Configuración de sesiones
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Cambiar a true si se usa HTTPS
}));

// Directorio donde se almacenarán los datos de los usuarios
const dataDir = __dirname + '/data';
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
}

// Archivos para almacenar datos de usuarios y usuarios eliminados
const usersFilePath = `${dataDir}/messages.json`;
const deletedUsersFilePath = `${dataDir}/deleted.json`;

// Inicializar archivos si no existen
if (!fs.existsSync(usersFilePath)) {
    fs.writeFileSync(usersFilePath, JSON.stringify([]), 'utf8');
}
if (!fs.existsSync(deletedUsersFilePath)) {
    fs.writeFileSync(deletedUsersFilePath, JSON.stringify([]), 'utf8');
}

// Función para cargar datos desde un archivo JSON
function loadData(filePath) {
    if (fs.existsSync(filePath)) {
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    }
    return [];
}

// Función para guardar datos en un archivo JSON
function saveData(filePath, data) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
}

// Ruta para el endpoint vulnerable a clickjacking
app.get('/exploit', (req, res) => {
    res.send(`
        <html>
        <head>
            <title>Clickjacking Exploit</title>
        </head>
        <body>
            <h1>Clickjacking Exploit</h1>
            <p>Click <a href="http://example.com" target="_blank">here</a> to go to example.com</p>
            <div style="position: absolute; opacity: 0.3; top: -35px; left: 0; width: 100%; height: 100%;">
                <iframe src="http://localhost:3000/" frameborder="0" width="100%" height="100%"></iframe>
            </div>
        </body>
        </html>
    `);
});

// Ruta para el endpoint vulnerable al registro y login
app.get('/', (req, res) => {
    let username = req.session.username;
    let password = req.session.password;

    // Leer y cargar datos de usuarios y usuarios eliminados
    const users = loadData(usersFilePath);
    const deletedUsers = loadData(deletedUsersFilePath);

    if (!!!req.session.username) {
      username = req.query.username;
      password = req.query.password;
    }
    // Verificar si el usuario ha sido eliminado
    if (username && deletedUsers.includes(username)) {
        console.log(`DETECTADA CUENTA ELIMINADA: ${username}`);
        res.send(`
            <html>
            <head>
                <title>Register/Login Page</title>
            </head>
            <body>
                <h1>Account has been deleted</h1>
                <form action="/login" method="post">
                    <label for="username">Enter your username:</label>
                    <input type="text" id="username" name="username" required>
                    <br>
                    <label for="password">Enter your password:</label>
                    <input type="password" id="password" name="password" required>
                    <br>
                    <button type="submit">Login/Register</button>
                </form>
                <p style="color: red;">This account has been deleted and cannot be used.</p>
            </body>
            </html>
        `);
        return;
    }

    // Verificar si el usuario ya está logueado en la sesión
    if (username && password) {
        let currentUser = users.find(user => user.username === username && user.password === password);
        if (currentUser) {
            res.send(`
                <html>
                <head>
                    <title>Welcome Page</title>
                </head>
                <body>
                    <h1>Welcome, ${currentUser.username}!</h1>
                    <p>Registration date: ${currentUser.registrationDate}</p>
                    <button onclick="deleteAccount()">Delete Account</button>
                    <button onclick="logout()">Logout</button>
                    <script>
                        function deleteAccount() {
                            fetch('/delete?username=${currentUser.username}&password=${currentUser.password}', {
                                method: 'DELETE'
                            })
                            .then(() => {
                                 window.location.href = '/';
                            })
                            .catch(error => {
                                console.error('Error deleting account:', error);
                                alert('Failed to delete account.');
                            });
                        }
                        function logout() {
                            fetch('/logout', { method: 'POST' })
                            .then(() => {
                                window.location.href = '/';
                            });
                        }
                    </script>
                </body>
                </html>
            `);
            return;
        }
    }

    // Si no está logueado, mostrar la página de login/registro
    res.send(`
        <html>
        <head>
            <title>Register/Login Page</title>
        </head>
        <body>
            <h1>Register/Login Page</h1>
            <form action="/login" method="post">
                <label for="username">Enter your username:</label>
                <input type="text" id="username" name="username" required>
                <br>
                <label for="password">Enter your password:</label>
                <input type="password" id="password" name="password" required>
                <br>
                <button type="submit">Login/Register</button>
            </form>
        </body>
        </html>
    `);
});

// Endpoint para manejar el login y registro de usuarios
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Leer y cargar datos de usuarios y usuarios eliminados
    const users = loadData(usersFilePath);
    const deletedUsers = loadData(deletedUsersFilePath);

    // Verificar si el usuario ha sido eliminado
    if (deletedUsers.includes(username)) {
        res.redirect(`/?username=${encodeURIComponent(username)}&password=deleted`);
        return;
    }

    // Verificar si el usuario existe en users
    let currentUser = users.find(user => user.username === username);

    if (currentUser) {
        if (currentUser.password === password) {
            // Guardar información del usuario en la sesión
            req.session.username = username;
            req.session.password = password;

            // Redirigir a la página principal después del login
            res.redirect('/');
        } else {
            // Contraseña incorrecta
            res.redirect(`/?username=${encodeURIComponent(username)}&password=wrong`);
        }
    } else {
        // Crear nuevo usuario
        const newUser = { username: username, password: password, registrationDate: new Date().toLocaleString() };
        users.push(newUser);

        // Guardar usuarios actualizados en messages.json
        saveData(usersFilePath, users);

        // Guardar información del usuario en la sesión
        req.session.username = username;
        req.session.password = password;

        // Redirigir a la página principal después del registro
        res.redirect('/');
    }
});

// Endpoint para eliminar la cuenta del usuario
app.delete('/delete', (req, res) => {
    const { username, password } = req.query;

    // Leer y cargar datos de usuarios
    let users = loadData(usersFilePath);
    const deletedUsers = loadData(deletedUsersFilePath);

    // Eliminar el usuario de messages.json
    users = users.filter(user => !(user.username === username && user.password === password));

    // Agregar el nombre del usuario a deleted.json
    if (!deletedUsers.includes(username)) {
        deletedUsers.push(username);
    }

    // Guardar los datos actualizados
    saveData(usersFilePath, users);
    saveData(deletedUsersFilePath, deletedUsers);

    // Destruir la sesión del usuario
    req.session.destroy();

    res.sendStatus(204); // No Content
});

// Endpoint para manejar el logout
app.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).send('Failed to logout');
        }
        res.redirect('/');
    });
});

// Función de sanitización para evitar la inserción de HTML
function sanitize(input) {
    return input.replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});

