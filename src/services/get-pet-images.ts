import type PetImagesRepository from '@/repositories/pet-images-repository.js'
import type PetsRepository from '@/repositories/pets-repository.js'
import { ResourceNotFoundError } from './errors/ResourceNotFoundError.js'

interface getPetImagesUseCaseRequest {
	petId: string
}

export class getPetImagesUseCase {
	constructor(
		private petsRepository: PetsRepository,
		private petImagesRepository: PetImagesRepository,
	){}

	async execute ({petId}: getPetImagesUseCaseRequest) {
		const pet = await this.petsRepository.findById(petId)

		if (!pet) throw new ResourceNotFoundError()

		const images = await this.petImagesRepository.findByPetId(petId)

		return images
	}
}