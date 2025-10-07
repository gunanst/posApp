import prisma from '@/lib/prisma';
import { hashPassword } from '@/lib/auth';

async function seed() {
    // Create admin user
    await prisma.user.upsert({
        where: { email: 'admin@mypos.com' },
        update: {},
        create: {
            username: 'admin',
            email: 'admin@mypos.com',
            password: hashPassword('admin123'),
            role: 'ADMIN'
        }
    });

    // Create cashier user
    await prisma.user.upsert({
        where: { email: 'kasir@mypos.com' },
        update: {},
        create: {
            username: 'kasir',
            email: 'kasir@mypos.com',
            password: hashPassword('kasir123'),
            role: 'KASIR'
        }
    });

    console.log('Database seeded successfully');
}

seed();