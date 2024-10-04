const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();

mongoose.connect('mongodb://localhost:27017/usersDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('MongoDB connected successfully');
}).catch((err) => {
    console.error('MongoDB connection error:', err);
});

app.use(cors());
app.use(bodyParser.json());

const User = mongoose.model('User', new mongoose.Schema({
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    uploadedFiles: [{ fileName: String, fileContent: String }]
}));

app.post('/register', async (req, res) => {
    const { name, username, email, password } = req.body;

    if (!name || !username || !email || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const user = new User({ name, username, email, password });
        await user.save();
        res.status(201).json({ message: 'Registration successful', username });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({ error: 'User already registered with this username or email' });
        }
        console.error('Error registering user:', err);
        res.status(500).json({ error: 'An error occurred during registration' });
    }
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
        const user = await User.findOne({ email, password });

        if (user) {
            res.status(200).json({ message: 'Login successful', username: user.username, uploadedFiles: user.uploadedFiles });
        } else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    } catch (err) {
        console.error('Error logging in:', err);
        res.status(500).json({ error: 'An error occurred during login' });
    }
});

app.get('/user/:username', async (req, res) => {
    const { username } = req.params;

    try {
        const user = await User.findOne({ username });

        if (user) {
            res.status(200).json({ uploadedFiles: user.uploadedFiles });
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (err) {
        console.error('Error retrieving user files:', err);
        res.status(500).json({ error: 'An error occurred while retrieving user files' });
    }
});


app.post('/saveFile', async (req, res) => {
    const { username, fileName, fileContent } = req.body;

    if (!username || !fileName || !fileContent) {
        return res.status(400).json({ error: 'Incomplete file details' });
    }

    try {
        const user = await User.findOne({ username });

        if (user) {
            user.uploadedFiles.push({ fileName, fileContent });
            await user.save();
            res.status(200).json({ message: 'File saved successfully' });
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (err) {
        console.error('Error saving file:', err);
        res.status(500).json({ error: 'An error occurred while saving the file' });
    }
});

const port = 5000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
