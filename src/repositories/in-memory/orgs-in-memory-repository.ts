import type { ORG } from '@/generated/prisma/client.js'
import type { ORGCreateInput } from '@/generated/prisma/models.js'
import { randomUUID } from 'node:crypto'
import type OrgsRepository from '../orgs-repository.js'


export default class OrgsInMemoryRepository implements OrgsRepository {
	public orgs: ORG[] = []

	async create(data: ORGCreateInput) {
		const org = {
			id: randomUUID(),
			name: data.name,
			owner: data.owner ?? null,
			email: data.email,
			zip_code: data.zip_code,
			city: data.city,
			address: data.address,
			phone: data.phone,
			password_hash: data.password_hash,
			created_at: new Date(),
		}

		this.orgs.push(org)

		return org
	}

	async findByEmail(email: string) {
		const orgByEmail = this.orgs.find((org) => org.email === email)
 
		return orgByEmail ?? null
	}

	async findById(id: string) {
		const orgById = this.orgs.find((org) => org.id === id)
 
		return orgById ?? null
	}
}