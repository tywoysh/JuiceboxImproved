const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    // Hard-coded user data
    const userData = [
        { username: 'alice', password: 'alicepassword' },
        { username: 'bob', password: 'bobpassword' },
        { username: 'carol', password: 'carolpassword' },
        { username: 'dave', password: 'davepassword' },
        { username: 'eve', password: 'evepassword' }
    ];

    // Hard-coded post data
    const postData = [
        { title: 'Post 1', content: 'This is post 1' },
        { title: 'Post 2', content: 'This is post 2' },
        { title: 'Post 3', content: 'This is post 3' },
    ];

    // Insert users and their posts
    for (let i = 0; i < userData.length; i++) {
        try {
            // Find or create user
            const user = await prisma.user.upsert({
                where: { username: userData[i].username },
                update: {},
                create: userData[i]
            });

            // Create posts for the user
            for (const post of postData) {
                await prisma.post.create({
                    data: {
                        title: post.title,
                        content: post.content,
                        userId: user.id
                    }
                });
            }

            console.log(`User ${userData[i].username} created/updated with posts.`);
        } catch (error) {
            console.error(`Error creating/updating user ${userData[i].username}:`, error);
            throw error; // Propagate the error to handle it appropriately
        }
    }

    console.log('Seeding completed!');
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

