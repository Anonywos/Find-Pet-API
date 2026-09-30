import type { Age, Energy, Environment, Independence, Size } from '@/generated/prisma/client.js'
import type PetsRepository from '@/repositories/pets-repository.js'

export interface PetFilters {
	city: string,
	age: Age | undefined,
	energy: Energy | undefined,
	size: Size | undefined,
	independence: Independence | undefined,
	environment: Environment | undefined,
}

interface FilterPetsUseCaseRequest {
	filters: PetFilters
	page: number | undefined,
}

export class FilterPetsUseCase {
	constructor(
		private petsRepository: PetsRepository,
	){}

	async execute ({filters, page }: FilterPetsUseCaseRequest) {
		const { pets, total } = await this.petsRepository.filterPets(filters, page ?? 1) 

		return {
			pets,
			totalPets: total,
		}
	}
}