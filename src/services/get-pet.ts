import type PetsRepository from '@/repositories/pets-repository.js'
import { ResourceNotFoundError } from './errors/ResourceNotFoundError.js'

interface getPetUseCaseRequest {
	petId: string
}

export class getPetUseCase {
	constructor(
		private petsRepository: PetsRepository,
	){}

	async execute ({petId}: getPetUseCaseRequest) {
		const pet = await this.petsRepository.findById(petId)

		if (!pet) throw new ResourceNotFoundError()

		return pet
	}
}