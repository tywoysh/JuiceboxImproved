const request = require('supertest');
const app = require('../server'); // Adjust the path to your server file
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


describe('GET /posts', () => {
    it('should fetch all posts', async () => {
        const response = await request(app)
            .get('/api/posts')
            .expect('Content-Type', /json/)
            .expect(200);

        // Assuming your application returns an array of posts in the response body
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBeGreaterThan(0); // Assuming there are posts in the database
    });
});

describe('GET /posts/:id', () => {
    let postId;

    beforeAll(async () => {
        // Assuming there's at least one post in the database
        const existingPost = await prisma.post.findFirst();
        if (existingPost) {
            postId = existingPost.id;
        } else {
            // If no post exists, you may need to create a post for testing
            const newPost = await prisma.post.create({
                data: {
                    title: 'Test Post',
                    content: 'This is a test post',
                    userId: 1, // Replace with a valid user ID from your database
                },
            });
            postId = newPost.id;
        }
    });
});