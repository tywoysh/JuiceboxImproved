const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function updatePasswords() {
    try {
        // Fetch all users from the database
        const users = await prisma.user.findMany();

        // Iterate over each user and update the password
        for (const user of users) {
            // Skip if password is already hashed (assume hashed passwords are longer than 20 characters)
            if (user.password.length > 20) continue;

            // Hash the plaintext password
            const hashedPassword = await bcrypt.hash(user.password, 10);

            // Update the user with the hashed password
            await prisma.user.update({
                where: { id: user.id },
                data: { password: hashedPassword },
            });

            console.log(`Updated password for user: ${user.username}`);
        }

        console.log('All passwords updated successfully!');
    } catch (error) {
        console.error('Error updating passwords:', error);
    } finally {
        await prisma.$disconnect();
    }
}

updatePasswords();
