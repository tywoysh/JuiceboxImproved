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
        { title: 'Alice Post 1', content: 'This is Alice post 1' },
        { title: 'Alice Post 2', content: 'This is Alice post 2' },
        { title: 'Alice Post 3', content: 'This is Alice post 3' },
        { title: 'Bob Post 1', content: 'This is Bob post 1' },
        { title: 'Bob Post 2', content: 'This is Bob post 2' },
        { title: 'Bob Post 3', content: 'This is Bob post 3' },
        { title: 'Carol Post 1', content: 'This is Carol post 1' },
        { title: 'Carol Post 2', content: 'This is Carol post 2' },
        { title: 'Carol Post 3', content: 'This is Carol post 3' },
        { title: 'Dave Post 1', content: 'This is Dave post 1' },
        { title: 'Dave Post 2', content: 'This is Dave post 2' },
        { title: 'Dave Post 3', content: 'This is Dave post 3' },
        { title: 'Eve Post 1', content: 'This is Eve post 1' },
        { title: 'Eve Post 2', content: 'This is Eve post 2' },
        { title: 'Eve Post 3', content: 'This is Eve post 3' },
    ];

    // Insert users and their posts
    for (let i = 0; i < userData.length; i++) {
        const user = await prisma.user.create({
            data: userData[i]
        });

        // Filter the posts for the current user
        const userPosts = postData.slice(i * 3, (i + 1) * 3);
        for (const post of userPosts) {
            await prisma.post.create({
                data: {
                    title: post.title,
                    content: post.content,
                    userId: user.id
                }
            });
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
