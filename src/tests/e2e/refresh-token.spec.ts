import { app } from '@/app.js'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('e2e - Refresh Token', () => {
	beforeAll(async () => {
		await app.ready()
	})

	afterAll(async () => {
		await app.close()
	})

	it('should be able to refresh the token', async () => {
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

		const authResponse = await request(app.server)
			.post('/sessions')
			.send({
				email: 'test@gmail.com',
				password: 'Ab123456@',
			})

		const cookies = authResponse.get('Set-Cookie')

		if (!cookies) {
			throw new Error('Cookie not found')
		}

		const response = await request(app.server)
			.patch('/token/refresh')
			.set('Cookie', cookies)
			.send()

		expect(response.statusCode).toEqual(200)
		expect(response.body).toEqual({
			token: expect.any(String),
		})
	})
})