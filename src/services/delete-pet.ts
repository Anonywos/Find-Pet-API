import type PetsRepository from '@/repositories/pets-repository.js'
import { ResourceNotFoundError } from './errors/ResourceNotFoundError.js'

interface DeletePetUseCaseRequest {
	petId: string
}

export class DeletePetUseCase {
	constructor(
		private petsRepository: PetsRepository,
	){}

	async execute ({petId}: DeletePetUseCaseRequest) {
		const pet = await this.petsRepository.deleteById(petId)

		if (!pet) throw new ResourceNotFoundError()

		return pet
	}
}