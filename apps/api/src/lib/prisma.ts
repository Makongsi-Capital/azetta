import { createPrismaClient } from '@azetta/db';
import { getEnv } from '../env';

const env = getEnv();

const globalForPrisma = globalThis as typeof globalThis & {
	prisma?: ReturnType<typeof createPrismaClient>;
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient(env.DATABASE_URL);

if (env.NODE_ENV !== 'production') {
	globalForPrisma.prisma = prisma;
}
