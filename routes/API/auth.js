const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Your secret key for JWT signing and verification
const SECRET_KEY = 'abc';

/**
 * @route GET /users
 * @desc GET all authors
 * @access Public
 */
router.get('/', async (req, res) => {
    try {
        const users = await prisma.user.findMany();
        res.status(200).json(users);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Something went wrong' });
    }
});

/**
 * @route POST /login
 * @desc Login a user
 * @access Public
 */
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Check if user exists
        const user = await prisma.user.findUnique({
            where: { username: username },
        });

        if (!user) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        // Validate password
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        // Generate JWT token
        const token = jwt.sign({ userId: user.id, username: user.username }, SECRET_KEY, {
            expiresIn: '1h', // Token expires in 1 hour
        });

        // Return token
        res.json({ token: token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

/**
 * @route POST /register
 * @desc Register a new user
 * @access Public
 */
router.post('/register', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Check if username is already taken
        const existingUser = await prisma.user.findUnique({
            where: { username: username },
        });

        if (existingUser) {
            return res.status(400).json({ error: 'Username already taken' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = await prisma.user.create({
            data: {
                username: username,
                password: hashedPassword,
            },
        });

        // Generate JWT token
        const token = jwt.sign({ userId: newUser.id, username: newUser.username }, SECRET_KEY, {
            expiresIn: '1h', // Token expires in 1 hour
        });

        // Return token
        res.status(201).json({ token: token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
