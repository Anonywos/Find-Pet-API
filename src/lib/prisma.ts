import { env } from '@/env/index.js'
import { PrismaClient } from '@/generated/prisma/client.js'
import { PrismaPg } from '@prisma/adapter-pg'


const currentEnv = env

const adapter = new PrismaPg({
	connectionString: currentEnv.DATABASE_URL,
})

export const prisma = new PrismaClient({
	adapter,
	log: currentEnv.NODE_ENV === 'dev' ? ['query'] : [],
})