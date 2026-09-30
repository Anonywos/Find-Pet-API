import type { ORG } from '@/generated/prisma/client.js'
import OrgsInMemoryRepository from '@/repositories/in-memory/orgs-in-memory-repository.js'
import { PetImagesInMemoryRepository } from '@/repositories/in-memory/pet-images-in-memory-repository.js'
import { PetsInMemoryRepository } from '@/repositories/in-memory/pets-in-memory-repository.js'
import { ResourceNotFoundError } from '@/services/errors/ResourceNotFoundError.js'
import { getPetImageDataUseCase } from '@/services/get-pet-image-data.js'
import { hash } from 'bcryptjs'
import { beforeAll, beforeEach, describe, expect, it } from 'vitest'

let repository: PetImagesInMemoryRepository
let petRepository: PetsInMemoryRepository
let sut: getPetImageDataUseCase
let orgsRepository: OrgsInMemoryRepository
let org: ORG

describe('Get Pet Images Data Use Case Unit Test', () => {
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
		petRepository = new PetsInMemoryRepository(orgsRepository)
		repository = new PetImagesInMemoryRepository()
		sut = new getPetImageDataUseCase(repository)
	})

	it('should be able to get pet images data by image ID', async () => {
		const pet = await petRepository.create({
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

		const data = new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])

		const imageId = await repository.create({
			file_name: 'image 1',
			mime_type: 'image/jpeg',
			data: data,
			petId: pet.id,
		})

		const image = await sut.execute({imageId: imageId})

		expect(image.id).toEqual(imageId)
		expect(image.mime_type).toEqual('image/jpeg')
		expect(image.data).toEqual(data)
	})

	it('should not be able to get pet images data without image ID', async () => {
		const pet = await petRepository.create({
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

		const data = new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])

		await repository.create({
			file_name: 'image 1',
			mime_type: 'image/jpeg',
			data: data,
			petId: pet.id,
		})

		await expect(() => sut.execute({imageId: ''}))
			.rejects.toBeInstanceOf(ResourceNotFoundError)
	})
})