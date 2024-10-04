const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt'); 
const app = express();

mongoose.connect('mongodb://localhost:27017/usersDB')
    .then(() => console.log('MongoDB connected successfully'))
    .catch(err => console.error('MongoDB connection error:', err));

app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

const FileSchema = new mongoose.Schema({
    fileName: { type: String, required: true } // Only file name
});

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    uploadedFiles: [FileSchema] // Use the FileSchema for uploaded files
});

const User = mongoose.model('User', UserSchema);

// Registration
app.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10); // Hash the password
        const user = new User({ username, email, password: hashedPassword });
        await user.save();
        res.status(201).json({ message: 'Registration successful', username });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({ error: 'Username or email already exists' });
        }
        res.status(500).json({ error: 'Error registering user' });
    }
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
        const user = await User.findOne({ email });
        if (user && await bcrypt.compare(password, user.password)) { // Compare hashed password
            res.status(200).json({ message: 'Login successful', username: user.username, uploadedFiles: user.uploadedFiles });
        } else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Error logging in' });
    }
});

app.get('/user/:username', async (req, res) => {
    const { username } = req.params;
    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json({ uploadedFiles: user.uploadedFiles });
    } catch (err) {
        console.error('Error fetching user:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});


app.post('/saveFile', async (req, res) => {
    const { username, fileName } = req.body; // Only receive username and fileName

    if (!username || !fileName) {
        return res.status(400).json({ error: 'Username and file name are required' });
    }

    try {
        const user = await User.findOne({ username });
        if (user) {
            user.uploadedFiles.push({ fileName }); // Only push the file name
            await user.save();
            res.status(200).json({ message: 'File name saved successfully' });
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (err) {
        console.error('Error saving file name:', err);
        res.status(500).json({ error: 'Error saving file name' });
    }
});



const port = process.env.PORT || 5000; // Use environment variable for port
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
