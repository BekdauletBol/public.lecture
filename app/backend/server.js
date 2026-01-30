// инициализация моделей
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error('MongoDB Connection Error:', err));

app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/videos', require('./routes/video.routes')); 

app.get('/', (req, res) => {
    res.send('public.edu is running');
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Server launched on: http://127.0.0.1:${PORT}`);
});