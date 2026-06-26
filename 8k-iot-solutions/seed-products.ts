import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log("Clearing old products...");
  await prisma.product.deleteMany({});

  const products = [
    {
      name: "Gym Management System",
      slug: "gym-management",
      description: "All-in-one platform to manage memberships, check-ins, personal training sessions, and recurring billing streams seamlessly.",
      price: "₱2,499/mo",
      imageUrl: null,
      features: JSON.stringify(["Member Portal", "QR Check-in", "Automated Billing"]),
      order: 1,
      isActive: true,
    },
    {
      name: "POS System",
      slug: "pos-system",
      description: "Fast, reliable Point of Sale software for retail and food service. Track inventory, process payments, and access sales analytics in real-time.",
      price: "₱1,999/mo",
      imageUrl: null,
      features: JSON.stringify(["Inventory Sync", "Offline Support", "Receipt Printing"]),
      order: 2,
      isActive: true,
    },
    {
      name: "Attendance Monitoring System",
      slug: "attendance-monitoring",
      description: "Seamless employee check-in and time-tracking system using RFID/biometric inputs and automated timesheet exports.",
      price: "₱1,499/mo",
      imageUrl: null,
      features: JSON.stringify(["RFID Integration", "Timesheet Export", "Leave Tracking"]),
      order: 3,
      isActive: true,
    },
    {
      name: "Payroll System",
      slug: "payroll-system",
      description: "Automated payroll processing with tax calculations, government contribution tracking, and direct bank payslip distribution.",
      price: "₱2,999/mo",
      imageUrl: null,
      features: JSON.stringify(["Tax Automation", "Payslip Generation", "Benefits Ledger"]),
      order: 4,
      isActive: true,
    }
  ];

  console.log("Seeding products...");

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: product,
      create: product,
    });
  }

  console.log("Seeding completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
