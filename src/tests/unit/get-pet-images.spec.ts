import type { ORG } from '@/generated/prisma/client.js'
import OrgsInMemoryRepository from '@/repositories/in-memory/orgs-in-memory-repository.js'
import { PetImagesInMemoryRepository } from '@/repositories/in-memory/pet-images-in-memory-repository.js'
import { PetsInMemoryRepository } from '@/repositories/in-memory/pets-in-memory-repository.js'
import { ResourceNotFoundError } from '@/services/errors/ResourceNotFoundError.js'
import { getPetImagesUseCase } from '@/services/get-pet-images.js'
import { hash } from 'bcryptjs'
import { beforeAll, beforeEach, describe, expect, it } from 'vitest'

let repository: PetsInMemoryRepository
let petImagesRepository: PetImagesInMemoryRepository
let sut: getPetImagesUseCase
let orgsRepository: OrgsInMemoryRepository
let org: ORG

describe('Get Pet Images Use Case Unit Test', () => {
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
		petImagesRepository = new PetImagesInMemoryRepository()
		sut = new getPetImagesUseCase(repository, petImagesRepository)
	})

	it('should be able to get pet images by pet ID', async () => {
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

		await petImagesRepository.create({
			file_name: 'image 1',
			data: new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
			petId: pet.id,
		})

		await petImagesRepository.create({
			file_name: 'image 2',
			data: new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
			petId: pet.id,
		})

		await petImagesRepository.create({
			file_name: 'image 3',
			data: new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
			petId: '12345',
		})

		const images = await sut.execute({petId: pet.id})

		expect(images.length).toEqual(2)
		expect(images).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					file_name: 'image 1',
				}),
				expect.objectContaining({
					file_name: 'image 2',
				}),
			]),
		)
	})

	it('should not be able to get pet images without pet ID', async () => {
		await expect(async () => sut.execute({petId: ''})).rejects
			.toBeInstanceOf(ResourceNotFoundError)
	})
})