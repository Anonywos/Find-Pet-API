import OrgsInMemoryRepository from '@/repositories/in-memory/orgs-in-memory-repository.js'
import { PetsInMemoryRepository } from '@/repositories/in-memory/pets-in-memory-repository.js'
import { CreatePetUseCase } from '@/services/create-pet.js'
import { ResourceNotFoundError } from '@/services/errors/ResourceNotFoundError.js'
import { hash } from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'

let orgRepository: OrgsInMemoryRepository
let repository: PetsInMemoryRepository
let sut: CreatePetUseCase

describe('Create Pet Use Case Unit Test', () => {
	beforeEach(() => {
		orgRepository = new OrgsInMemoryRepository()
		repository = new PetsInMemoryRepository(orgRepository)
		sut = new CreatePetUseCase(repository, orgRepository)
	})

	it('should be able to create a pet', async () => {
		const org = await orgRepository.create({
			name: 'Seu Cãopanheiro',
			email: 'test@gmail.com',
			owner: null,
			zip_code: '12345-000',
			city: 'São Paulo',
			address: 'Rua do teste',
			phone: '(99) 99999-9999',
			password_hash: await hash('123456', 6),
		})

		const pet = await sut.execute({
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

		expect(pet.id).toEqual(expect.any(String))
		expect(pet.name).toEqual('Bidu')
	})

	it('should not be able to create a pet without a exist org id', async () => {

		await expect(sut.execute({
			orgId: '',
			name: 'Bidu',
			description: null,
			age: 'JUNIOR',
			energy: 'HIGH',
			size: 'SMALL',
			environment: 'SMALL',
			independence: 'MEDIUM',
			requirements: [],
		})).rejects.toBeInstanceOf(ResourceNotFoundError)
	})
})