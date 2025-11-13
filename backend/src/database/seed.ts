import { PrismaClient, Role } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create a test admin user
  const hashedPassword = await hash('admin123', 10);
  
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@insightiq.com' },
    update: {},
    create: {
      email: 'admin@insightiq.com',
      passwordHash: hashedPassword,
      name: 'Admin User',
      role: Role.ADMIN,
    },
  });

  console.log('✅ Created admin user:', adminUser.email);

  // Create a test analyst user
  const analystPassword = await hash('analyst123', 10);
  
  const analystUser = await prisma.user.upsert({
    where: { email: 'analyst@insightiq.com' },
    update: {},
    create: {
      email: 'analyst@insightiq.com',
      passwordHash: analystPassword,
      name: 'Test Analyst',
      role: Role.ANALYST,
    },
  });

  console.log('✅ Created analyst user:', analystUser.email);

  console.log('🎉 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

