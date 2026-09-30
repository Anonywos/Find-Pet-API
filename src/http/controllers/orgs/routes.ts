import verifyJWT from '@/http/middlewares/verify-jwt.js'
import type { FastifyInstance } from 'fastify'
import { authenticate } from './authenticate.js'
import { profile } from './profile.js'
import { refreshToken } from './refreshToken.js'
import { register } from './register.js'


export async function orgsRoutes(app:FastifyInstance) {
	app.post('/orgs', register)
	app.post('/sessions', authenticate)
	app.patch('/token/refresh', refreshToken)

	//Auth
	app.get('/profile', {onRequest: verifyJWT}, profile)
}