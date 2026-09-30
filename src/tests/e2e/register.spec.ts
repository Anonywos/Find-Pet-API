import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

let app: Awaited<typeof import('@/app.js')>['app']

describe('e2e - Register ORG', () => {
	beforeAll(async () => {
		const appModule = await import('@/app.js')
		app = appModule.app

		await app.ready()
	})

	afterAll(async () => {
		await app.close()
	})

	it('should be able to register an ORG', async () => {
		const response = await request(app.server)
			.post('/orgs')
			.send({
				name: 'Seu Cãopanheiro',
				email: 'test@gmail.com',
				owner: null,
				zip_code: '12345-000',
				city: 'São Paulo',
				address: 'Rua do teste',
				phone: '(99) 99999-9999',
				password: 'Ab123456@',
			})

		expect(response.statusCode).toEqual(201)
	})

	it('should not be able to register an ORG with a incorrect formatation password', async () => {
		const response = await request(app.server)
			.post('/orgs')
			.send({
				name: 'Seu Cãopanheiro',
				email: 'test@gmail.com',
				owner: null,
				zip_code: '12345-000',
				city: 'São Paulo',
				address: 'Rua do teste',
				phone: '(99) 99999-9999',
				password: 'Ab123456',
			})

		expect(response.statusCode).toEqual(400)
	})
})