import type { ORG } from '@/generated/prisma/client.js'
import OrgsInMemoryRepository from '@/repositories/in-memory/orgs-in-memory-repository.js'
import { PetsInMemoryRepository } from '@/repositories/in-memory/pets-in-memory-repository.js'
import { DeletePetUseCase } from '@/services/delete-pet.js'
import { ResourceNotFoundError } from '@/services/errors/ResourceNotFoundError.js'
import { hash } from 'bcryptjs'
import { beforeAll, beforeEach, describe, expect, it } from 'vitest'

let repository: PetsInMemoryRepository
let sut: DeletePetUseCase
let orgsRepository: OrgsInMemoryRepository
let org: ORG

describe('Delete Pet Use Case Unit Test', () => {
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
		sut = new DeletePetUseCase(repository)
	})

	it('should be able to delete a pet by id', async () => {
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

		const deletedPet = await sut.execute({petId: pet.id})
		const deletedPetCheck = await repository.findById(pet.id)

		expect(deletedPet?.id).toEqual(pet.id)
		expect(deletedPet?.name).toEqual('Pet 1')
		expect(deletedPetCheck).toEqual(null)
	})

	it('should not be able to delete a non-existent pet', async () => {

		await expect(sut.execute({petId: ''}))
			.rejects.toBeInstanceOf(ResourceNotFoundError)
	})
})