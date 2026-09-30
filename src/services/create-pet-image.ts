import type PetImagesRepository from '@/repositories/pet-images-repository.js'
import type PetsRepository from '@/repositories/pets-repository.js'
import { ResourceNotFoundError } from './errors/ResourceNotFoundError.js'

interface CreatePetImageUseCaseRequest {
	file_name: string
	mime_type: string
	data: Uint8Array<ArrayBuffer>
	petId: string
}

export class CreatePetImageUseCase {
	constructor(
		private petImagesRepository: PetImagesRepository,
		private petsRepository: PetsRepository,
	){}

	async execute({
		file_name,
		mime_type,
		data,
		petId,
	}: CreatePetImageUseCaseRequest): Promise<string> {
		const pet = await this.petsRepository.findById(petId)

		if (!pet) {
			throw new ResourceNotFoundError()
		}

		const id  = await this.petImagesRepository.create({
			file_name,
			mime_type,
			data,
			petId,
		})

		return id
	}
}