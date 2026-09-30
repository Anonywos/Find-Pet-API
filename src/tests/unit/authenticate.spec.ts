import OrgsInMemoryRepository from '@/repositories/in-memory/orgs-in-memory-repository.js'
import { AuthenticateUseCase } from '@/services/authenticate.js'
import { InvalidCredentialsError } from '@/services/errors/InvalidCredentialsError.js'
import { ResourceNotFoundError } from '@/services/errors/ResourceNotFoundError.js'
import { hash } from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'

let repository: OrgsInMemoryRepository
let sut: AuthenticateUseCase

describe('Authenticate Use Case Unit Test', () => {
	beforeEach(() => {
		repository = new OrgsInMemoryRepository()
		sut = new AuthenticateUseCase(repository)
	})

	it('should be able to authenticate a ORG', async () => {
		const org = await repository.create({
			name: 'Seu Cãopanheiro',
			email: 'test@gmail.com',
			owner: null,
			zip_code: '12345-000',
			city: 'São Paulo',
			address: 'Rua do teste',
			phone: '(99) 99999-9999',
			password_hash: await hash('123456', 6),
		})

		const authOrg = await sut.execute({
			email: 'test@gmail.com',
			password: '123456',
		})

		expect(authOrg.id).toEqual(org.id)
	})

	it('should not be able to authenticate with a wrong password', async () => {
		await repository.create({
			name: 'Seu Cãopanheiro',
			email: 'test@gmail.com',
			owner: null,
			zip_code: '12345-000',
			city: 'São Paulo',
			address: 'Rua do teste',
			phone: '(99) 99999-9999',
			password_hash: await hash('123456', 6),
		})

		await expect(sut.execute({
			email: 'test@gmail.com',
			password: '123465',
		})).rejects.toBeInstanceOf(InvalidCredentialsError)
	})

	it('should not be able to authenticate with a wrong email', async () => {
		await repository.create({
			name: 'Seu Cãopanheiro',
			email: 'test@gmail.com',
			owner: null,
			zip_code: '12345-000',
			city: 'São Paulo',
			address: 'Rua do teste',
			phone: '(99) 99999-9999',
			password_hash: await hash('123456', 6),
		})

		await expect(sut.execute({
			email: 'test2@gmail.com',
			password: '123456',
		})).rejects.toBeInstanceOf(ResourceNotFoundError)
	})
})