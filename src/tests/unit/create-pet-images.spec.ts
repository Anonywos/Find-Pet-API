import type { PET } from '@/generated/prisma/client.js'
import OrgsInMemoryRepository from '@/repositories/in-memory/orgs-in-memory-repository.js'
import { PetImagesInMemoryRepository } from '@/repositories/in-memory/pet-images-in-memory-repository.js'
import { PetsInMemoryRepository } from '@/repositories/in-memory/pets-in-memory-repository.js'
import { CreatePetImageUseCase } from '@/services/create-pet-image.js'
import { ResourceNotFoundError } from '@/services/errors/ResourceNotFoundError.js'
import { hash } from 'bcryptjs'
import { beforeAll, beforeEach, describe, expect, it } from 'vitest'

let repository: PetImagesInMemoryRepository
let sut: CreatePetImageUseCase
let petsRepository: PetsInMemoryRepository
let pet: PET

describe('Create Pet Image Use Case Unit Test', () => {
	beforeAll(async () => {
		const orgsRepository = new OrgsInMemoryRepository()
		petsRepository = new PetsInMemoryRepository(orgsRepository)

		const org = await orgsRepository.create({
			name: 'Seu Cãopanheiro',
			email: 'test@gmail.com',
			owner: null,
			zip_code: '12345-000',
			city: 'São Paulo',
			address: 'Rua do teste',
			phone: '(99) 99999-9999',
			password_hash: await hash('123456', 6),
		})

		pet = await petsRepository.create({
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
	})

	beforeEach(() => {
		repository = new PetImagesInMemoryRepository()
		sut = new CreatePetImageUseCase(repository, petsRepository)
	})

	it('should be able to upload a pets image', async () => {
		const imageId = await sut.execute({
			file_name: 'pet_image-test.png',
			data: new Uint8Array([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]),
			petId: pet.id,
		})

		expect(imageId).toEqual(expect.any(String))
	})

	it('should not be able to upload a pets image without pet ID', async () => {
		await expect(sut.execute({
			file_name: 'pet_image-test.png',
			data: new Uint8Array([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]),
			petId: '',
		})).rejects.toBeInstanceOf(ResourceNotFoundError)
	})
})