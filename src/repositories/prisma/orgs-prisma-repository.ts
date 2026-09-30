import type { ORGCreateInput } from '@/generated/prisma/models.js'
import { prisma } from '@/lib/prisma.js'
import type OrgsRepository from '../orgs-repository.js'


export class OrgsPrismaRepository implements OrgsRepository {
	async create(data: ORGCreateInput) {
		const org = await prisma.oRG.create({data})

		return org
	}

	async findByEmail(email: string){
		const org = await prisma.oRG.findUnique({
			where: {
				email,
			},
		})

		return org
	}
	
	async findById(id: string) {
		const org = await prisma.oRG.findUnique({
			where: {
				id,
			},
		})

		return org
	}

}