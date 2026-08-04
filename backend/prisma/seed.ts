import bcrypt from 'bcryptjs';
import { prisma } from '../src/shared/database/prisma.js';

async function main() {
  console.log('🌱 Starting database seeding...');

  // 1. System Settings
  const existingSettings = await prisma.systemSetting.findFirst();
  if (!existingSettings) {
    await prisma.systemSetting.create({
      data: {
        companyName: 'El-Ma3ras Clothing Factory',
        currency: 'EGP',
        defaultTaxRate: 0,
        phone: '+20 100 000 0000',
        address: 'Cairo, Egypt',
      },
    });
    console.log('✅ System Settings created');
  } else {
    console.log('ℹ️ System Settings already exist');
  }

  // 2. Main Branch
  const mainBranch = await prisma.branch.upsert({
    where: { code: 'MAIN' },
    update: {
      name: 'Main Branch',
      isActive: true,
    },
    create: {
      name: 'Main Branch',
      code: 'MAIN',
      address: 'Headquarters - Cairo',
      phone: '+20 100 000 0000',
      isActive: true,
    },
  });
  console.log('✅ Main Branch seeded:', mainBranch.name);

  // 3. Admin User
  const adminEmail = 'admin@erp.com';
  const passwordHash = await bcrypt.hash('Admin@123', 10);

  const adminUser = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      fullName: 'System Admin',
      passwordHash,
      userType: 'ADMIN',
      isActive: true,
      deletedAt: null,
    },
    create: {
      fullName: 'System Admin',
      email: adminEmail,
      passwordHash,
      userType: 'ADMIN',
      isActive: true,
    },
  });
  console.log('✅ Admin User seeded:', adminUser.email);

  // 4. Assign Admin User to Main Branch
  await prisma.userBranch.upsert({
    where: {
      userId_branchId: {
        userId: adminUser.id,
        branchId: mainBranch.id,
      },
    },
    update: {},
    create: {
      userId: adminUser.id,
      branchId: mainBranch.id,
    },
  });
  console.log('✅ Admin assigned to Main Branch');

  // 5. Default Sizes
  const defaultSizes = [
    { name: 'XS', sortOrder: 1 },
    { name: 'S', sortOrder: 2 },
    { name: 'M', sortOrder: 3 },
    { name: 'L', sortOrder: 4 },
    { name: 'XL', sortOrder: 5 },
    { name: 'XXL', sortOrder: 6 },
  ];

  for (const size of defaultSizes) {
    await prisma.size.upsert({
      where: { name: size.name },
      update: { sortOrder: size.sortOrder, isActive: true },
      create: { name: size.name, sortOrder: size.sortOrder, isActive: true },
    });
  }
  console.log('✅ Default Sizes seeded (XS, S, M, L, XL, XXL)');

  // 6. Default Expense Categories
  const expenseCategories = [
    { name: 'Rent', description: 'Facility and branch rental expenses' },
    { name: 'Salaries', description: 'Employee payroll and compensation' },
    { name: 'Electricity', description: 'Utility bills for power and electricity' },
    { name: 'Transportation', description: 'Logistics and transportation costs' },
    { name: 'Maintenance', description: 'Equipment and building maintenance' },
  ];

  for (const cat of expenseCategories) {
    await prisma.expenseCategory.upsert({
      where: { name: cat.name },
      update: { description: cat.description, isActive: true },
      create: { name: cat.name, description: cat.description, isActive: true },
    });
  }
  console.log('✅ Default Expense Categories seeded');

  console.log('🎉 Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
