import type { PET_IMAGE, Prisma } from '@/generated/prisma/client.js'
import { randomUUID } from 'node:crypto'
import type PetImagesRepository from '../pet-images-repository.js'


export class PetImagesInMemoryRepository implements PetImagesRepository {
	public items: PET_IMAGE[] = []

	async create(data: Prisma.PET_IMAGEUncheckedCreateInput) {
		const petImage = {
			id: randomUUID(),
			file_name: data.file_name,
			mime_type: data.mime_type,
			data: data.data,
			created_at: new Date(),
			petId: data.petId,
		}

		this.items.push(petImage)

		return petImage.id
	}

	async findByPetId(petId: string) {
		const images = this.items.filter((image) => image.petId === petId )
			.map(image => {
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
				const { data, ...metadata } = image
				return metadata
			})

		return images
	}

	async getImageDataById(imageId: string) {
		const image = this.items.find((image) => image.id === imageId)

		if (!image) return null

		const { id, mime_type, data } = image

		return {
			id,
			mime_type,
			data,
		}
	}
}