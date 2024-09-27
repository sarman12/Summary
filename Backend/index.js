const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const { Sequelize, DataTypes } = require('sequelize');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.db'
});

const User = sequelize.define('User', {
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

sequelize.sync()
    .then(() => {
        console.log('Database & tables created!');
    })
    .catch(err => {
        console.error('Error creating database', err);
    });

// Test route
app.get('/', (req, res) => {
    res.send('Hello, World!');
});

// Registration route
app.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).send('Please provide a username, email, and password');
    }

    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = await User.create({ username, email, password: hashedPassword });

        res.status(201).send(`User ${newUser.username} registered successfully`);
    } catch (err) {
        res.status(500).send('Error registering user: ' + err.message);
    }
});

// Login route
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).send('Please enter your email and password');
    }

    try {
        // Find the user by email
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(404).send('User not found');
        }

        // Compare the password with the hashed password
        const match = await bcrypt.compare(password, user.password);

        if (match) {
            res.send('Login successful');
        } else {
            res.status(401).send('Incorrect password');
        }
    } catch (err) {
        res.status(500).send('Error logging in: ' + err.message);
    }
});


// Start the server
app.listen(port, () => {
    console.log("server is running on port " + port);
});
