const request = require('supertest');
const app = require('../server'); // Adjust the path to your server file
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const middleware = require('../routes/API/middleware')

jest.mock('../routes/API/middleware', () => {
    return (req, res, next) => {
        req.user = { userId: 1 }; // Mock user ID
        next();
    };
});


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
            // If no post exists, create a post for testing
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

    it('should fetch a specific post by ID', async () => {
        const response = await request(app)
            .get(`/api/posts/${postId}`)
            .expect('Content-Type', /json/)
            .expect(200);

        // Assuming the response body is the post object
        expect(response.body).toHaveProperty('id', postId);
        expect(response.body).toHaveProperty('title');
        expect(response.body).toHaveProperty('content');
        expect(response.body).toHaveProperty('userId');
    });

    it('should return 404 for a non-existent post ID', async () => {
        const nonExistentId = 99999; // Use an ID that you know doesn't exist
        await request(app)
            .get(`/api/posts/${nonExistentId}`)
            .expect(404);
    });
});

describe('POST /posts', () => {
    it('should create a new post and return it', async () => {
        const newPostData = { title: 'New Test Post', content: 'New Test Content' };

        const response = await request(app)
            .post('/api/posts')
            .send(newPostData)
            .expect('Content-Type', /json/)
            .expect(201);

        // Check if the response body matches the expected output
        expect(response.body).toHaveProperty('id');
        expect(response.body).toHaveProperty('title', newPostData.title);
        expect(response.body).toHaveProperty('content', newPostData.content);
        expect(response.body).toHaveProperty('userId', 1); // Ensure userId is set correctly
    });

    // it('should return 500 if there is an error', async () => {
    //     const newPostData = { title: 'New Test Post', content: 'New Test Content' };

    //     // Mock Prisma client's create method to throw an error
    //     jest.spyOn(prisma.post, 'create').mockImplementation(() => {
    //         throw new Error('Something went wrong');
    //     });

    //     const response = await request(app)
    //         .post('/api/posts')
    //         .send(newPostData)
    //         .expect(500);

    //     expect(response.body).toEqual({ error: 'Something went wrong' });

    //     // Restore the original implementation
    //     prisma.post.create.mockRestore();
    // });
});