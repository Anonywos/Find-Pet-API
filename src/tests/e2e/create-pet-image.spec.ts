import { app } from '@/app.js'
import { prisma } from '@/lib/prisma.js'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { getAuthorizatedORGCookies } from '../helpers/getAuthorizatedORGCookies.js'

describe('e2e - Create an Image Pet', () => {
	beforeAll(async () => {
		await app.ready()
	})

	afterAll(async () => {
		await app.close()
	})

	it('should be able to create an image pet', async () => {
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

		const imageBuffer = Buffer.from('fake image content')

		const response = await request(app.server)
			.post(`/pets/${pet.id}/images`)
			.set('Cookie', cookies)
			.attach('file', imageBuffer, {
				filename: 'pet-image.png',
				contentType: 'image/png',
			})

		expect(response.status).toEqual(201)
	})

	it('should be able to create an image pet with wrong type', async () => {
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

		const imageBuffer = Buffer.from('fake image content')

		const response = await request(app.server)
			.post(`/pets/${pet.id}/images`)
			.set('Cookie', cookies)
			.attach('file', imageBuffer, {
				filename: 'pet-image.svg',
				contentType: 'image/svg',
			})

		expect(response.status).toEqual(400)
	})

	it('should be able to create an image pet without image', async () => {
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
			.post(`/pets/${pet.id}/images`)
			.set('Cookie', cookies)

		expect(response.status).toEqual(400)
	})
})