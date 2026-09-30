import { app } from '@/app.js'
import { prisma } from '@/lib/prisma.js'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { getAuthorizatedORGCookies } from '../helpers/getAuthorizatedORGCookies.js'

describe('e2e - Get Pet Image Data', () => {
	beforeAll(async () => {
		await app.ready()
	})

	afterAll(async () => {
		await app.close()
	})

	it('should be able to get pet image data by ID', async () => {
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

		const data = new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0])

		const { id: imageId } = await prisma.pET_IMAGE.create({
			data:
				{
					file_name: 'img 1',
					mime_type: 'image/jpeg',
					data: data,
					petId: pet.id,
				},
		})

		const response = await request(app.server)
			.get(`/pets/images/${imageId}`)
			.set('Cookie', cookies)
			.send()

		console.log(response.body)
		expect(response.statusCode).toEqual(200)
		expect(response.headers['content-type']).toContain(
			'image/jpeg',
		)
		expect(Array.from(response.body)).toEqual(Array.from(data))
	})

	it('should not be able to get pet images without pet ID', async () => {
		const cookies = await getAuthorizatedORGCookies(app)

		const response = await request(app.server)
			.get('/pets/images/123456')
			.set('Cookie', cookies)
			.send()

		expect(response.statusCode).toEqual(404)
	})
})