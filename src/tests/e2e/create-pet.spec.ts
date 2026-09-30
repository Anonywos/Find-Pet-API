import { app } from '@/app.js'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { getAuthorizatedORGCookies } from '../helpers/getAuthorizatedORGCookies.js'

describe('e2e - Create Pet', () => {
	beforeAll(async () => {
		await app.ready()
	})

	afterAll(async () => {
		await app.close()
	})

	it('should be able to create a pet', async () => {
		const cookies = await getAuthorizatedORGCookies(app)

		const response = await request(app.server)
			.post('/pets')
			.set('Cookie', cookies)
			.send({
				name: 'pet test',
				description: null,
				age: 'JUNIOR',
				energy: 'HIGH',
				size: 'SMALL',
				environment: 'SMALL',
				independence: 'MEDIUM',
				requirements: [],
			})

		expect(response.status).toEqual(201)
	})

	it('should not be able to create a pet without authorization', async () => {
		const response = await request(app.server)
			.post('/pets')
			.send({
				name: 'pet test',
				description: null,
				age: 'JUNIOR',
				energy: 'HIGH',
				size: 'SMALL',
				environment: 'SMALL',
				independence: 'MEDIUM',
				requirements: [],
			})

		expect(response.status).toEqual(401)
	})

	it('should not be able to create a pet without an exist ORG', async () => {
		const token = await app.jwt.sign({
			sign: {
				sub: '12345',
			},
		})
		
		const response = await request(app.server)
			.post('/pets')
			.set('Authorization', `Bearer ${token}`)
			.send({
				name: 'pet test',
				description: null,
				age: 'JUNIOR',
				energy: 'HIGH',
				size: 'SMALL',
				environment: 'SMALL',
				independence: 'MEDIUM',
				requirements: [],
			})

		expect(response.status).toEqual(404)
	})
})