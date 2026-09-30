import { app } from '@/app.js'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('e2e - Get ORG Profile', () => {
	beforeAll(async () => {
		await app.ready()
	})

	afterAll(async () => {
		await app.close()
	})

	it('should be able to get an ORG profile', async () => {
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

		const { token } = authResponse.body

		if (!token) {
			throw new Error('Token not found')
		}

		const response = await request(app.server)
			.get('/profile')
			.set('Authorization', `Bearer ${token}`)
			.send()

		expect(response.statusCode).toEqual(200)
		expect(response.body.org).toEqual(
			expect.objectContaining({
				name: 'Seu Cãopanheiro',
				email: 'test@gmail.com',
				owner: null,
				zip_code: '12345-000',
				city: 'São Paulo',
				address: 'Rua do teste',
				phone: '(99) 99999-9999',
			}),
		)
	})

	it('should not be able to get a non-existent ORG', async () => {
		const fakeToken = await app.jwt.sign({
			sign: {
				sub: '123',
			},
		})

		const response = await request(app.server)
			.get('/profile')
			.set('Authorization', `Bearer ${fakeToken}`)
			.send()
		
		expect(response.statusCode).toEqual(404)
	})
})