const { PrismaClient } = require('@prisma/client');
console.log('Keys in PrismaClient instance:', Object.keys(new PrismaClient()).filter(k => k.toLowerCase().includes('school')));
