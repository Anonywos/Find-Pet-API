import type OrgsRepository from '@/repositories/orgs-repository.js'
import { ResourceNotFoundError } from './errors/ResourceNotFoundError.js'


interface ProfileUseCaseRequest {
	id: string,
}

export class ProfileUseCase {
	constructor(private orgsRepository: OrgsRepository){}

	async execute ({ id }: ProfileUseCaseRequest) {
		const orgById = await this.orgsRepository.findById(id)

		if (!orgById) {
			throw new ResourceNotFoundError()
		}

		return orgById
	}
}