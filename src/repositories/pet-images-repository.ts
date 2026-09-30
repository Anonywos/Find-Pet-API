import type { Prisma } from '@/generated/prisma/client.js'

interface petImageMetadata {
	id: string,
	file_name: string,
	created_at: Date,
	petId: string,
}

export interface petImageMetadataReturn {
	id: string,
	mime_type: string,
	data: Uint8Array,
}

export default interface PetImagesRepository {
	create(data: Prisma.PET_IMAGEUncheckedCreateInput): Promise<string>
	findByPetId(petId: string): Promise<petImageMetadata[]>
	getImageDataById(imageId: string): Promise<petImageMetadataReturn | null>
}