import type { PET, Prisma } from '@/generated/prisma/client.js'
import type { PetFilters } from '@/services/filter-pets.js'


export default interface PetsRepository {
	create(data: Prisma.PETUncheckedCreateInput): Promise<PET>
	findById(id: string): Promise<PET | null>
	filterPets(filters: PetFilters, page: number): Promise<{pets: PET[], total: number}>
}