import prisma from './prisma';

export async function testDatabase() {
    try {
        console.log('🔌 Testing database connection...');

        // Test connection
        await prisma.$connect();
        console.log('✅ Database connected successfully');

        // Test user query
        const users = await prisma.user.findMany();
        console.log(`👥 Users in database: ${users.length}`);

        users.forEach(user => {
            console.log(`- ${user.username} (${user.email}) - ${user.role}`);
        });

        await prisma.$disconnect();
    } catch (error) {
        console.error('❌ Database connection failed:', error);
    }
}

// Run test
testDatabase();