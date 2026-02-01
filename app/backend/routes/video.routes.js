const express = require('express');
const router = express.Router();
const multer = require('multer');
const Video = require('../models/Video');
const auth = require('../middlewares/auth.middleware');
const checkRole = require('../middlewares/checkRole');

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

const uploadFields = upload.fields([
    { name: 'video', maxCount: 1 },    
    { name: 'thumbnail', maxCount: 1 } 
]);

router.post('/upload', auth, checkRole('teacher'), uploadFields, async (req, res) => {
    try {
        if (!req.files || !req.files['video']) {
            return res.status(400).json({ error: "Video file is required" });
        }

        const videoFile = req.files['video'][0];
        const thumbFile = req.files['thumbnail'] ? req.files['thumbnail'][0] : null;

        const newVideo = new Video({
            title: req.body.title,
            category: req.body.category,
            videoUrl: videoFile.path.replace(/\\/g, "/"),
            thumbnailUrl: thumbFile ? thumbFile.path.replace(/\\/g, "/") : "" ,
            teacher: req.user.id
        });

        await newVideo.save();
        res.status(201).json(newVideo);
    } catch (err) {
        console.error("Upload error:", err);
        res.status(500).json({ error: err.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const videos = await Video.find().populate('teacher', 'username');
        res.json(videos);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;