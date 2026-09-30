import { app } from '@/app.js'
import { prisma } from '@/lib/prisma.js'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { getAuthorizatedORGCookies } from '../helpers/getAuthorizatedORGCookies.js'

describe('e2e - Get Pet Images', () => {
	beforeAll(async () => {
		await app.ready()
	})

	afterAll(async () => {
		await app.close()
	})

	it('should be able to get pet images', async () => {
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

		await prisma.pET_IMAGE.createMany({
			data: [
				{
					file_name: 'img 1',
					mime_type: 'image/jpeg',
					data: new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0]),
					petId: pet.id,
				},
				{
					file_name: 'img 2',
					mime_type: 'image/jpeg',
					data: new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0]),
					petId: pet.id,
				},
			],
		})

		const response = await request(app.server)
			.get(`/pets/${pet.id}/images`)
			.set('Cookie', cookies)
			.send()

		expect(response.statusCode).toEqual(200)
		expect(response.body.petImages).toHaveLength(2)
		expect(response.body.petImages).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					file_name: 'img 1',
				}),
				expect.objectContaining({
					file_name: 'img 2',
				}),
			]),
		)
	})

	it('should not be able to get pet images without pet ID', async () => {
		const cookies = await getAuthorizatedORGCookies(app)

		const response = await request(app.server)
			.get('/pets//images')
			.set('Cookie', cookies)
			.send()

		expect(response.statusCode).toEqual(404)
	})
})