import type { PET } from '@/generated/prisma/client.js'
import type { PETUncheckedCreateInput } from '@/generated/prisma/models.js'
import { prisma } from '@/lib/prisma.js'
import type { PetFilters } from '@/services/filter-pets.js'
import type PetsRepository from '../pets-repository.js'


export class petsPrismaRepository implements PetsRepository {
	async create(data: PETUncheckedCreateInput): Promise<PET> {
		const pet = await prisma.pET.create({data})

		return pet
	}
	async findById(id: string): Promise<PET | null> {
		const pet = await prisma.pET.findUnique({
			where: {
				id,
			},
		})

		return pet
	}
	async filterPets(filters: PetFilters, page: number): Promise<{ pets: PET[]; total: number; }> {
		const itemsPerPage = 20

		const pets = await prisma.pET.findMany({
			where: {
				org: {
					city: filters.city,
				},
				...(filters.age !== undefined && {
					age: filters.age,
				}),
				...(filters.energy !== undefined && {
					energy: filters.energy,
				}),
				...(filters.environment !== undefined && {
					environment: filters.environment,
				}),
				...(filters.independence !== undefined && {
					independence: filters.independence,
				}),
				...(filters.size !== undefined && {
					size: filters.size,
				}),
			},
			take: itemsPerPage,
			skip: (page - 1) * itemsPerPage,
		})

		const totalPets = await prisma.pET.count({
			where: {
				org: {
					city: filters.city,
				},
				...(filters.age !== undefined && {
					age: filters.age,
				}),
				...(filters.energy !== undefined && {
					energy: filters.energy,
				}),
				...(filters.environment !== undefined && {
					environment: filters.environment,
				}),
				...(filters.independence !== undefined && {
					independence: filters.independence,
				}),
				...(filters.size !== undefined && {
					size: filters.size,
				}),
			},
		})

		return {
			pets,
			total: totalPets,
		}
	}
	
}