require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

if (!fs.existsSync('./uploads')) fs.mkdirSync('./uploads');

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('✅ MongoDB Connected'))
    .catch(err => console.error('❌ DB Error:', err));

app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/videos', require('./routes/video.routes'));
app.use('/api/users', require('./routes/user.routes'));

app.get('/', (req, res) => {
    res.send('public.edu API is running');
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    const status = err.status || 500;
    res.status(status).json({
        error: {
            message: err.message || 'Internal Server Error',
            status: status
        }
    });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Server launched on: http://127.0.0.1:${PORT}`);
});