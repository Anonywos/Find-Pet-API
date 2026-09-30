import { app } from '@/app.js'
import request from 'supertest'
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import cleanDatabase from '../../../prisma/vitest-environment/clean-database.js'
import { getAuthorizatedORGCookies } from '../helpers/getAuthorizatedORGCookies.js'

describe('e2e - Filter Pets', () => {
	beforeAll(async () => {
		await app.ready()
	})

	beforeEach(async () => {
		await cleanDatabase()
	})

	afterAll(async () => {
		await app.close()
	})

	it('should be able to filter pets', async () => {
		const cookies = await getAuthorizatedORGCookies(app)

		await request(app.server)
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

		await request(app.server)
			.post('/pets')
			.set('Cookie', cookies)
			.send({
				name: 'pet test 2',
				description: null,
				age: 'JUNIOR',
				energy: 'HIGH',
				size: 'LARGE',
				environment: 'SMALL',
				independence: 'MEDIUM',
				requirements: [],
			})

		const response = await request(app.server)
			.get('/pets')
			.set('Cookie', cookies)
			.query({
				city: 'São Paulo',
			})
			.send()

		expect(response.statusCode).toEqual(200)
		expect(response.body.pets.pets).toHaveLength(2)
		expect(response.body.pets.totalPets).toEqual(2)
		expect(response.body.pets.pets).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					name: 'pet test',
				}),
				expect.objectContaining({
					name: 'pet test 2',
				}),
			]),
		)
	})

	it('should be able to filter pets with others filters', async () => {
		const cookies = await getAuthorizatedORGCookies(app)

		await request(app.server)
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

		await request(app.server)
			.post('/pets')
			.set('Cookie', cookies)
			.send({
				name: 'pet test 2',
				description: null,
				age: 'JUNIOR',
				energy: 'HIGH',
				size: 'LARGE',
				environment: 'SMALL',
				independence: 'MEDIUM',
				requirements: [],
			})

		const response = await request(app.server)
			.get('/pets')
			.set('Cookie', cookies)
			.query({
				city: 'São Paulo',
				size: 'LARGE',
			})
			.send()

		expect(response.statusCode).toEqual(200)
		expect(response.body.pets.pets).toHaveLength(1)
		expect(response.body.pets.pets).toEqual([
			expect.objectContaining({
				name: 'pet test 2',
			}),
		])
	})
})