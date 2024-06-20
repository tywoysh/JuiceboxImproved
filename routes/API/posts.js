const express = require('express');
const router = express.Router();
const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();
const middleware = require('./middleware');

/**
 * @route GET /posts
 * @desc GET all posts
 * @access Private (TODO)
 */

router.get('/', middleware, async (req, res) => {
    try {
        // Get the user ID from the request object set by authMiddleware
        const userId = req.user.userId;

        // Fetch posts for the logged-in user
        const posts = await prisma.post.findMany({
            where: { userId: userId },
        });

        res.status(200).json(posts);
    } catch (error) {
        console.log(error);
        res.status(500).json({error: 'Something went wrong'});
    }
})


/**
 * @route GET /posts/:id
 * @desc Get a specific post by id for the logged-in user
 * @access Private
 */
router.get('/:id', middleware, async (req, res) => {
    const postId = parseInt(req.params.id, 10);
    const userId = req.user.userId;

    try {
        // Fetch the post by id and userId
        const post = await prisma.post.findUnique({
            where: {
                id: postId,
            },
        });

        // Check if the post exists and belongs to the logged-in user
        if (!post || post.userId !== userId) {
            return res.status(404).json({ error: 'Post not found or you do not have access to this post' });
        }

        res.status(200).json(post);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong' });
    }
});


/**
 * @route POST /posts
 * @desc Create a new post
 * @access Private
 */
router.post('/', middleware, async (req, res) => {
    const { title, content } = req.body;
    const userId = req.user.userId;

    try {
        // Create a new post
        const newPost = await prisma.post.create({
            data: {
                title: title,
                content: content,
                userId: userId,
            },
        });

        res.status(201).json(newPost);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong' });
    }
});


router.put('/:id', middleware, async (req, res) => {
    const postId = parseInt(req.params.id, 10);
    const { title, content } = req.body;
    const userId = req.user.userId;

    try {
        // Fetch the post by id
        const post = await prisma.post.findUnique({
            where: {
                id: postId,
            },
        });

        // Check if the post exists and belongs to the logged-in user
        if (!post || post.userId !== userId) {
            return res.status(404).json({ error: 'Post not found or you do not have access to this post' });
        }

        // Update the post
        const updatedPost = await prisma.post.update({
            where: {
                id: postId,
            },
            data: {
                title: title,
                content: content,
            },
        });

        res.status(200).json(updatedPost);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong' });
    }
});


/**
 * @route DELETE /posts/:id
 * @desc Delete a post by id for the logged-in user
 * @access Private
 */
router.delete('/:id', middleware, async (req, res) => {
    const postId = parseInt(req.params.id, 10);
    const userId = req.user.userId;

    try {
        // Fetch the post by id
        const post = await prisma.post.findUnique({
            where: {
                id: postId,
            },
        });

        // Check if the post exists and belongs to the logged-in user
        if (!post || post.userId !== userId) {
            return res.status(404).json({ error: 'Post not found or you do not have access to this post' });
        }

        // Delete the post
        await prisma.post.delete({
            where: {
                id: postId,
            },
        });

        res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong' });
    }
});

module.exports = router;