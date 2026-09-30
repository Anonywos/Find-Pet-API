import type { ORG } from '@/generated/prisma/client.js'
import OrgsInMemoryRepository from '@/repositories/in-memory/orgs-in-memory-repository.js'
import { PetsInMemoryRepository } from '@/repositories/in-memory/pets-in-memory-repository.js'
import { FilterPetsUseCase } from '@/services/filter-pets.js'
import { hash } from 'bcryptjs'
import { beforeAll, beforeEach, describe, expect, it } from 'vitest'

let repository: PetsInMemoryRepository
let sut: FilterPetsUseCase
let orgsRepository: OrgsInMemoryRepository
let org: ORG

describe('Filter Pets Use Case Unit Test', () => {
	beforeAll(async () => {
		orgsRepository = new OrgsInMemoryRepository()

		org = await orgsRepository.create({
			name: 'Seu Cãopanheiro',
			email: 'test@gmail.com',
			owner: null,
			zip_code: '12345-000',
			city: 'São Paulo',
			address: 'Rua do teste',
			phone: '(99) 99999-9999',
			password_hash: await hash('123456', 6),
		})
	})

	beforeEach(() => {
		repository = new PetsInMemoryRepository(orgsRepository)
		sut = new FilterPetsUseCase(repository)
	})

	it('should be able to filter pets by city', async () => {
		await repository.create({
			orgId: org.id,
			name: 'Bidu',
			description: null,
			age: 'JUNIOR',
			energy: 'HIGH',
			size: 'SMALL',
			environment: 'SMALL',
			independence: 'MEDIUM',
			requirements: [],
		})

		await repository.create({
			orgId: org.id,
			name: 'Malu',
			description: null,
			age: 'JUNIOR',
			energy: 'HIGH',
			size: 'SMALL',
			environment: 'SMALL',
			independence: 'MEDIUM',
			requirements: [],
		})

		const { pets, totalPets } = await sut.execute({filters: {city: 'São Paulo'}})

		expect(pets).toHaveLength(2)
		expect(totalPets).toEqual(2)
	})

	it('should be able to fetch paginated pets', async () => {
		for (let i = 0; i < 23; i++) {
			await repository.create({
				orgId: org.id,
				name: `pet ${i}`,
				description: null,
				age: 'JUNIOR',
				energy: 'HIGH',
				size: 'SMALL',
				environment: 'SMALL',
				independence: 'MEDIUM',
				requirements: [],
			})
		}

		const { pets, totalPets } = await sut.execute({filters: {city: 'São Paulo'}, page: 2})

		expect(pets).toHaveLength(3)
		expect(totalPets).toEqual(23)
	})

	it('should not be able to fetch pets without a city', async () => {
		await repository.create({
			orgId: org.id,
			name: 'Bidu',
			description: null,
			age: 'JUNIOR',
			energy: 'HIGH',
			size: 'SMALL',
			environment: 'SMALL',
			independence: 'MEDIUM',
			requirements: [],
		})

		const { pets, totalPets } = await sut.execute({filters: {city: ''}})

		expect(pets).toHaveLength(0)
		expect(totalPets).toEqual(0)
	})

	it('should be able to filter pets with other filters', async () => {
		await repository.create({
			orgId: org.id,
			name: 'Pet 1',
			description: null,
			age: 'JUNIOR',
			energy: 'HIGH',
			size: 'SMALL',
			environment: 'SMALL',
			independence: 'MEDIUM',
			requirements: [],
		})

		await repository.create({
			orgId: org.id,
			name: 'Pet 2',
			description: null,
			age: 'JUNIOR',
			energy: 'HIGH',
			size: 'LARGE',
			environment: 'LARGE',
			independence: 'MEDIUM',
			requirements: [],
		})

		await repository.create({
			orgId: org.id,
			name: 'Pet 3',
			description: null,
			age: 'ADULT',
			energy: 'LOW',
			size: 'SMALL',
			environment: 'SMALL',
			independence: 'MEDIUM',
			requirements: [],
		})

		const { pets, totalPets } = await sut.execute({filters: {
			city: 'São Paulo',
			age: 'JUNIOR',
			size: 'SMALL',
		}})

		expect(pets).toHaveLength(1)
		expect(pets).toEqual([expect.objectContaining({
			name: 'Pet 1',
		})])
		expect(totalPets).toEqual(1)
	})
})