import type { ORG } from '@/generated/prisma/client.js'
import OrgsInMemoryRepository from '@/repositories/in-memory/orgs-in-memory-repository.js'
import { PetsInMemoryRepository } from '@/repositories/in-memory/pets-in-memory-repository.js'
import { ResourceNotFoundError } from '@/services/errors/ResourceNotFoundError.js'
import { getPetUseCase } from '@/services/get-pet.js'
import { hash } from 'bcryptjs'
import { beforeAll, beforeEach, describe, expect, it } from 'vitest'

let repository: PetsInMemoryRepository
let sut: getPetUseCase
let orgsRepository: OrgsInMemoryRepository
let org: ORG

describe('Get Pet Use Case Unit Test', () => {
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
		sut = new getPetUseCase(repository)
	})

	it('should be able to get a pet by id', async () => {
		const pet = await repository.create({
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

		const fetchedPet = await sut.execute({petId: pet.id})

		expect(fetchedPet?.id).toEqual(pet.id)
		expect(fetchedPet?.name).toEqual('Pet 1')
	})

	it('should not be able to get a pet without id', async () => {
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

		await expect(sut.execute({petId: ''}))
			.rejects.toBeInstanceOf(ResourceNotFoundError)
	})
})