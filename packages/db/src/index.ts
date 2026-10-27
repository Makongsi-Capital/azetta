import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from './generated/prisma/client';

export * from './generated/prisma/client';
export type * from './generated/prisma/models';
export { PrismaPg };

export function createPrismaClient(connectionString: string): PrismaClient {
	return new PrismaClient({
		adapter: new PrismaPg({ connectionString })
	});
}
