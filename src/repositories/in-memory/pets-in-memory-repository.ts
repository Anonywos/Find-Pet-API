import type { PET } from '@/generated/prisma/client.js'
import type { PETUncheckedCreateInput } from '@/generated/prisma/models.js'
import type { PetFilters } from '@/services/filter-pets.js'
import { randomUUID } from 'node:crypto'
import type PetsRepository from '../pets-repository.js'
import type OrgsInMemoryRepository from './orgs-in-memory-repository.js'


export class PetsInMemoryRepository implements PetsRepository {
	public items:  PET[] = []

	//Simula a intereção do prisma entre tabelas
	constructor(private orgsRepository: OrgsInMemoryRepository) {}

	async create(data: PETUncheckedCreateInput){
		const pet = {
			id: randomUUID(),
			name: data.name,
			description: data.description ?? null,
			age: data.age,
			energy: data.energy,
			size: data.size,
			independence: data.independence,
			environment: data.environment,
			requirements: Array.isArray(data.requirements)
				? data.requirements
				: data.requirements?.set ?? [],
			created_at: new Date(),
			orgId: data.orgId,
		}

		this.items.push(pet)

		return pet
	}

	async findById(id: string) {
		const pet = this.items.find((pet) => pet.id === id)

		return pet ?? null
	}

	async filterPets(filter: PetFilters, page: number) {
		const filteredPets: PET[] = []
		const itemsPerPage = 20

		for (const pet of this.items) {
			const org = await this.orgsRepository.findById(pet.orgId)
			
			if (org?.city !== filter.city) {
				continue
			}

			//Age
			if (filter.age && filter.age !== pet.age) {
				continue
			}
			//Energy
			if (filter.energy && filter.energy !== pet.energy) {
				continue
			}
			//Size
			if (filter.size && filter.size !== pet.size) {
				continue
			}
			//Environment
			if (filter.environment && filter.environment !== pet.environment) {
				continue
			}
			//Independence
			if (filter.independence && filter.independence !== pet.independence) {
				continue
			}

			filteredPets.push(pet)
		}

		const totalPets = filteredPets.length

		return {
			pets: filteredPets.slice((page - 1) * itemsPerPage, page * itemsPerPage),
			total: totalPets,
		}
	}
}