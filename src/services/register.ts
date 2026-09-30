import type { ORG } from '@/generated/prisma/client.js'
import type OrgsRepository from '@/repositories/orgs-repository.js'
import { hash } from 'bcryptjs'
import { OrgAlreadyExistsError } from './errors/OrgAlreadyExistError.js'

interface RegisterUseCaseRequest {
	name: string,
	owner: string | null,
	email: string,
	zip_code: string,
	city: string,
	address: string,
	phone: string,
	password: string
}

export class RegisterUseCase {
	constructor(private orgsRepository: OrgsRepository){}

	async execute({
		name,
		owner,
		email,
		zip_code,
		city,
		address,
		phone,
		password,
	}: RegisterUseCaseRequest): Promise<ORG> {
		const password_hash = await hash(password, 6)

		const orgsWithSameEmail = await this.orgsRepository.findByEmail(email)

		if (orgsWithSameEmail) {
			throw new OrgAlreadyExistsError()
		}

		const org = await this.orgsRepository.create({
			name,
			owner,
			email,
			zip_code,
			city,
			address,
			phone,
			password_hash,
		})

		return org
	}
}