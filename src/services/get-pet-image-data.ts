import type PetImagesRepository from '@/repositories/pet-images-repository.js'
import { ResourceNotFoundError } from './errors/ResourceNotFoundError.js'

interface getPetImageDataUseCaseRequest {
	imageId: string
}

export class getPetImageDataUseCase {
	constructor(
		private petImagesRepository: PetImagesRepository,
	){}

	async execute ({imageId}: getPetImageDataUseCaseRequest) {
		const imageData = await this.petImagesRepository.getImageDataById(imageId)

		if (!imageData) throw new ResourceNotFoundError()

		return imageData
	}
}