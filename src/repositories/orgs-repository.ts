import type { ORG, Prisma } from '@/generated/prisma/client.js'


export default interface OrgsRepository {
	create(data: Prisma.ORGCreateInput): Promise<ORG>
	findByEmail(email: string): Promise<ORG | null>
	findById(id: string): Promise<ORG | null> 
}