import { app } from '@/app.js'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('e2e - Authenticate an ORG', () => {
	beforeAll(async () => {
		await app.ready()
	})

	afterAll(async () => {
		await app.close()
	})

	it('should be able to authenticate an ORG', async () => {
		await request(app.server)
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

		const response = await request(app.server)
			.post('/sessions')
			.send({
				email: 'test@gmail.com',
				password: 'Ab123456@',
			})

		expect(response.statusCode).toEqual(200)
		expect(response.body).toEqual({
			token: expect.any(String),
		})
	})
})