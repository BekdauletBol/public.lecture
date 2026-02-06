const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middlewares/auth.middleware');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, 'avatar-' + Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

router.get('/teachers', async (req, res) => {
    try {
        const teachers = await User.find({ role: 'teacher' }).select('username email profilePicture');
        res.json(teachers);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/profile', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password'); 
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/profile', auth, async (req, res) => {
    try {
        const { username, email } = req.body;
        
        if (email && !email.includes('@')) {
            return res.status(400).json({ error: "Invalid email format" });
        }

        const updates = {};
        if (username) updates.username = username;
        if (email) updates.email = email;

        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            { $set: updates },
            { new: true }
        ).select('-password');

        res.json(updatedUser);
    } catch (err) {
        if (err.code === 11000) return res.status(400).json({ error: "Email already exists" });
        res.status(500).json({ error: err.message });
    }
});

router.put('/profile/picture', auth, upload.single('avatar'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: "No file uploaded" });

        const profilePath = req.file.path.replace(/\\/g, "/");
        const user = await User.findByIdAndUpdate(
            req.user.id, 
            { profilePicture: profilePath },
            { new: true }
        );

        res.json({ 
            message: "Profile picture updated", 
            profilePicture: user.profilePicture 
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;