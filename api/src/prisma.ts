import { PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined;
}

const prismaClientInstance =
  global.prisma ||
  new PrismaClient({
    log: ['query', 'info', 'warn'],
  });

export default prismaClientInstance;

if (process.env.NODE_ENV !== 'production') global.prisma = prismaClientInstance;
