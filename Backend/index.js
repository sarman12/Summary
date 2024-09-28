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
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    uploadedFiles: [{ fileName: String, fileContent: String }]
}));

app.post('/register', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
        const user = new User({ email, password });
        await user.save();
        res.status(201).json({ message: 'Registration successful' });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({ error: 'User already registered with this email' });
        }
        console.error('Error registering user:', err);
        res.status(500).json({ error: 'An error occurred during registration' });
    }
});

// Login route
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
        const user = await User.findOne({ email, password });

        if (user) {
            res.status(200).json({ message: 'Login successful', user });
        } else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    } catch (err) {
        console.error('Error logging in:', err);
        res.status(500).json({ error: 'An error occurred during login' });
    }
});

app.post('/upload', async (req, res) => {
    const { email, fileName, fileContent } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        user.uploadedFiles.push({ fileName, fileContent });
        await user.save();

        res.status(200).json({ message: 'File uploaded and saved successfully', user });
    } catch (err) {
        console.error('Error uploading file:', err);
        res.status(500).json({ error: 'An error occurred while uploading the file' });
    }
});

app.get('/files/:email', async (req, res) => {
    const { email } = req.params;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Respond with user's uploaded files
        res.status(200).json({ uploadedFiles: user.uploadedFiles });
    } catch (err) {
        console.error('Error fetching files:', err);
        res.status(500).json({ error: 'An error occurred while fetching files' });
    }
});

// Start the server
const port = 5000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
