const UserSchema = require('../models/userSchema');
const express = require("express")
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userRouter = express.Router();

// Register a new user
userRouter.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new UserSchema({ name, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'User registered succesfully' });
});

// Login a user
userRouter.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await UserSchema.findOne({ email });

    if (!user) return res.status(400).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ user: user._id }, process.env.jwt_secret, { expiresIn: '7d' });
    res.json({ token });
});

module.exports = userRouter;
