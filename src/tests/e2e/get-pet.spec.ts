import { app } from '@/app.js'
import { prisma } from '@/lib/prisma.js'
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

	it('should be able to get a pet', async () => {
		const cookies = await getAuthorizatedORGCookies(app)

		const org = await prisma.oRG.findFirstOrThrow()

		const pet = await prisma.pET.create({
			data: {
				name: 'pet test',
				description: null,
				age: 'JUNIOR',
				energy: 'HIGH',
				size: 'SMALL',
				environment: 'SMALL',
				independence: 'MEDIUM',
				requirements: [],
				orgId: org.id,
			},
		})

		const response = await request(app.server)
			.get(`/pets/${pet.id}`)
			.set('Cookie', cookies)
			.send()

		expect(response.statusCode).toEqual(200)
	})

	it('should be able to get a pet without id', async () => {
		const cookies = await getAuthorizatedORGCookies(app)

		const org = await prisma.oRG.findFirstOrThrow()

		await prisma.pET.create({
			data: {
				name: 'pet test',
				description: null,
				age: 'JUNIOR',
				energy: 'HIGH',
				size: 'SMALL',
				environment: 'SMALL',
				independence: 'MEDIUM',
				requirements: [],
				orgId: org.id,
			},
		})

		const response = await request(app.server)
			.get('/pets/1111')
			.set('Cookie', cookies)
			.send()

		expect(response.statusCode).toEqual(404)
	})
})