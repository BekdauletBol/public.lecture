const express = require('express');
const router = express.Router();
const multer = require('multer');
const Video = require('../models/Video');

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

router.post('/upload', upload.single('video'), async (req, res) => {
    try {
        const newVideo = new Video({
            title: req.body.title,
            category: req.body.category,
            videoUrl: req.file.path
        });
        await newVideo.save();
        res.status(201).json(newVideo);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/', async (req, res) => {
    const videos = await Video.find();
    res.json(videos);
});

module.exports = router;