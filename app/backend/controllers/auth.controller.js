// логика регистрации 

const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long" });
        }
        if (!email.includes('@')) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User with this email already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        
        const newUser = new User({ 
            username, 
            email, 
            role: role || 'student', 
            password: hashedPassword 
        });

        await newUser.save();
        
        res.status(201).json({ message: "User created successfully" });
    } catch (err) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" }); 
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role }, 
            process.env.JWT_SECRET, 
            { expiresIn: '24h' }
        );
        
        res.json({ 
            token, 
            user: { 
                id: user._id,
                username: user.username, 
                role: user.role,
                profilePicture: user.profilePicture
            } 
        });
    } catch (err) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};