import { app } from '@/app.js'
import { prisma } from '@/lib/prisma.js'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { getAuthorizatedORGCookies } from '../helpers/getAuthorizatedORGCookies.js'

describe('e2e - Delete Pet', () => {
	beforeAll(async () => {
		await app.ready()
	})

	afterAll(async () => {
		await app.close()
	})

	it('should be able to delete a pet by id', async () => {
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
			.delete(`/pets/${pet.id}`)
			.set('Cookie', cookies)
			.send()

		expect(response.statusCode).toEqual(204)
	})

	it('should be able to delete a pet without id', async () => {
		const cookies = await getAuthorizatedORGCookies(app)

		await prisma.oRG.findFirstOrThrow()

		const response = await request(app.server)
			.get('/pets/1111')
			.set('Cookie', cookies)
			.send()

		expect(response.statusCode).toEqual(404)
	})
})