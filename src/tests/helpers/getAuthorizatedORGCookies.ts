import type { FastifyInstance } from 'fastify'
import request from 'supertest'

export async function getAuthorizatedORGCookies(app: FastifyInstance) {
	await request(app.server)
		.post('/orgs')
		.send({
			name: 'ORG test',
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

	return cookies
}