import type { ORG } from '@/generated/prisma/client.js'
import type OrgsRepository from '@/repositories/orgs-repository.js'
import { compare } from 'bcryptjs'
import { InvalidCredentialsError } from './errors/InvalidCredentialsError.js'
import { ResourceNotFoundError } from './errors/ResourceNotFoundError.js'

interface AuthenticateUseCaseRequest {
	email: string,
	password: string
}

export class AuthenticateUseCase {
	constructor(private orgsRepository: OrgsRepository){}

	async execute({
		email,
		password,
	}: AuthenticateUseCaseRequest): Promise<ORG> {
		const org = await this.orgsRepository.findByEmail(email)

		if (!org) {
			throw new ResourceNotFoundError()
		}

		const doesPasswordMatch = await compare(password, org.password_hash)

		if(!doesPasswordMatch) {
			throw new InvalidCredentialsError()
		}

		return org
	}
}