// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const SECRET_KEY = 'abc';

const authMiddleware = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access denied, no token provided' });
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.user = decoded; // Save the decoded user information in the request object

        // Check if user exists
        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
        });

        if (!user) {
            return res.status(401).json({ error: 'Invalid token' });
        }

        next();
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: 'Invalid token' });
    }
};

module.exports = authMiddleware;
