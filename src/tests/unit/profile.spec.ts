import OrgsInMemoryRepository from '@/repositories/in-memory/orgs-in-memory-repository.js'
import { ResourceNotFoundError } from '@/services/errors/ResourceNotFoundError.js'
import { ProfileUseCase } from '@/services/profile.js'
import { RegisterUseCase } from '@/services/register.js'
import { randomUUID } from 'node:crypto'
import { beforeEach, describe, expect, it } from 'vitest'

let repository: OrgsInMemoryRepository
let registerOrg: RegisterUseCase
let sut: ProfileUseCase

describe('Profile Use Case Unit Test', () => {
	beforeEach(() => {
		repository = new OrgsInMemoryRepository()
		registerOrg = new RegisterUseCase(repository)
		sut = new ProfileUseCase(repository)
	})

	it('should be able to get a ORG profile', async () => {
		const { id } = await registerOrg.execute({
			name: 'Seu Cãopanheiro',
			email: 'test@gmail.com',
			owner: null,
			zip_code: '12345-000',
			city: 'São Paulo',
			address: 'Rua do teste',
			phone: '(99) 99999-9999',
			password: '123456',
		})

		const org = await sut.execute({ id })

		expect(org.id).toEqual(id)
		expect(org.email).toEqual('test@gmail.com')
	})

	it('should not be able to get a ORG profile with a wrong ID', async () => {
		await registerOrg.execute({
			name: 'Seu Cãopanheiro',
			email: 'test@gmail.com',
			owner: null,
			zip_code: '12345-000',
			city: 'São Paulo',
			address: 'Rua do teste',
			phone: '(99) 99999-9999',
			password: '123456',
		})

		const id = randomUUID()

		await expect(
			sut.execute({ id }),
		).rejects.toBeInstanceOf(ResourceNotFoundError)
	})
})