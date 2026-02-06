const express = require('express');
const router = express.Router();
const multer = require('multer');
const Video = require('../models/Video');
const auth = require('../middlewares/auth.middleware');
const checkRole = require('../middlewares/checkRole');
const fs = require('fs');

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
        const { title, category } = req.body;

        if (!title || title.trim().length < 3) {
            return res.status(400).json({ error: "Title must be at least 3 characters long" });
        }
        if (!category) {
            return res.status(400).json({ error: "Category is required" });
        }

        if (!req.files || !req.files['video']) {
            return res.status(400).json({ error: "Video file is required" });
        }

        const videoFile = req.files['video'][0];
        const thumbFile = req.files['thumbnail'] ? req.files['thumbnail'][0] : null;

        const newVideo = new Video({
            title: req.body.title,
            category: req.body.category,
            description: req.body.description,
            videoUrl: videoFile.path.replace(/\\/g, "/"),
            thumbnailUrl: thumbFile ? thumbFile.path.replace(/\\/g, "/") : "" ,
            teacher: req.user.id 
        });

        await newVideo.save();
        res.status(201).json(newVideo);
    } catch (err) {
        console.error("Upload error:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.get('/:id', auth, async (req, res) => {
    try {
        const video = await Video.findById(req.params.id).populate('teacher', 'username');
        if (!video) return res.status(404).json({ message: "Video not found" });
        res.json(video);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/', auth, async (req, res) => {
    try {
        const videos = await Video.find().populate('teacher', 'username');
        res.json(videos);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/:id', auth, async (req, res) => {
    try {
        const video = await Video.findById(req.params.id);
        if (!video) return res.status(404).json({ message: "Video not found" });

        if (video.teacher.toString() !== req.user.id) {
            return res.status(403).json({ message: "Access denied: You can only update your own videos" });
        }

        if (req.body.title && req.body.title.trim().length < 3) {
            return res.status(400).json({ error: "New title is too short" });
        }

        if (req.body.title) video.title = req.body.title;
        if (req.body.description) video.description = req.body.description;
        if (req.body.category) video.category = req.body.category;

        await video.save();
        res.json({ message: "Updated successfully", video });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete('/:id', auth, async (req, res) => {
    try {
        const video = await Video.findById(req.params.id);
        if (!video) return res.status(404).json({ message: "Video not found" });

        if (video.teacher.toString() !== req.user.id) {
            return res.status(403).json({ message: "Access denied: You can only delete your own videos" });
        }

        if (fs.existsSync(video.videoUrl)) fs.unlinkSync(video.videoUrl);
        if (video.thumbnailUrl && fs.existsSync(video.thumbnailUrl)) {
            fs.unlinkSync(video.thumbnailUrl);
        }

        await Video.findByIdAndDelete(req.params.id);
        res.json({ message: "Video deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;