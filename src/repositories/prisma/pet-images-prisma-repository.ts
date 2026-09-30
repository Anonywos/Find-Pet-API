import type { PET_IMAGEUncheckedCreateInput } from '@/generated/prisma/models.js'
import { prisma } from '@/lib/prisma.js'
import type PetImagesRepository from '../pet-images-repository.js'


export class PetImagesPrismaRepository implements PetImagesRepository {
	async create(data: PET_IMAGEUncheckedCreateInput): Promise<string> {
		const petImages = await prisma.pET_IMAGE.create({
			data: data,
		})

		return petImages.id
	}

	async findByPetId(petId: string) {
		const petImages = await prisma.pET_IMAGE.findMany({
			where: {
				petId: petId,
			},
			select: {
				id: true,
				file_name: true,
				created_at: true,
				petId: true,
			},
		})

		return petImages
	}

	async getImageDataById(imageId: string) {
		const petImageData = await prisma.pET_IMAGE.findUnique({
			where: {
				id: imageId,
			},
			select: {
				id: true,
				mime_type: true,
				data: true,
			},
		})

		return petImageData
	}
}