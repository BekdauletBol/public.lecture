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