import OrgsInMemoryRepository from '@/repositories/in-memory/orgs-in-memory-repository.js'
import { OrgAlreadyExistsError } from '@/services/errors/OrgAlreadyExistError.js'
import { RegisterUseCase } from '@/services/register.js'
import { compare } from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'

let repository: OrgsInMemoryRepository
let sut: RegisterUseCase

describe('Register Use Case Unit Test', () => {
	beforeEach(() => {
		repository = new OrgsInMemoryRepository()
		sut = new RegisterUseCase(repository)
	})

	it('should be able to register a ORG', async () => {
		const org = await sut.execute({
			name: 'Seu Cãopanheiro',
			email: 'test@gmail.com',
			owner: null,
			zip_code: '12345-000',
			city: 'São Paulo',
			address: 'Rua do teste',
			phone: '(99) 99999-9999',
			password: '123456',
		})

		expect(org.id).toEqual(expect.any(String))
	})

	it('should not be able to register two ORG with same email', async () => {
		await sut.execute({
			name: 'Seu Cãopanheiro',
			email: 'test@gmail.com',
			owner: null,
			zip_code: '12345-000',
			city: 'São Paulo',
			address: 'Rua do teste',
			phone: '(99) 99999-9999',
			password: '123456',
		})

		await expect(
			sut.execute({
				name: 'Seu Cãopanheiro 2',
				email: 'test@gmail.com',
				owner: null,
				zip_code: '12346-000',
				city: 'São Paulo',
				address: 'Rua do teste 2',
				phone: '(99) 99999-9999',
				password: '123456',
			}),
		).rejects.toBeInstanceOf(OrgAlreadyExistsError)
	})

	it('should be able to hash org password upon registration', async () => {
		const org = await sut.execute({
			name: 'Seu Cãopanheiro',
			email: 'test@gmail.com',
			owner: null,
			zip_code: '12345-000',
			city: 'São Paulo',
			address: 'Rua do teste',
			phone: '(99) 99999-9999',
			password: '123456',
		})

		const isPasswordCorrectlyHashed = await compare(
			'123456',
			org.password_hash,
		)

		expect(isPasswordCorrectlyHashed).toBe(true)
	})
})