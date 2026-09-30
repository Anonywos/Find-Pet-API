import type { Age, Energy, Environment, Independence, PET, Size } from '@/generated/prisma/client.js'
import type OrgsRepository from '@/repositories/orgs-repository.js'
import type PetsRepository from '@/repositories/pets-repository.js'
import { ResourceNotFoundError } from './errors/ResourceNotFoundError.js'

interface CreatePetUseCaseRequest {
	orgId: string,
	name: string,
	description: string | null,
	age: Age,
	energy: Energy,
	size: Size,
	independence: Independence,
	environment: Environment,
	requirements: string[],
}

export class CreatePetUseCase {
	constructor(
		private petsRepository: PetsRepository,
		private orgsRepository: OrgsRepository,
	){}

	async execute({
		orgId,
		name,
		description,
		age,
		energy,
		size,
		independence,
		environment,
		requirements,
	}: CreatePetUseCaseRequest): Promise<PET> {
		const org = await this.orgsRepository.findById(orgId)

		if (!org) {
			throw new ResourceNotFoundError()
		}

		const createdPet = await this.petsRepository.create({
			orgId,
			name,
			description,
			age,
			energy,
			size,
			independence,
			environment,
			requirements,
		})

		return createdPet
	}
}