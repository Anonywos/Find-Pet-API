import fastifyCookie from '@fastify/cookie'
import fastifyJwt from '@fastify/jwt'
import fastifyMultipart from '@fastify/multipart'
import fastify from 'fastify'
import z, { ZodError } from 'zod'
import { env } from './env/index.js'
import { orgsRoutes } from './http/controllers/orgs/routes.js'
import { petsRoutes } from './http/controllers/pets/routes.js'


export const app = fastify()

app.register(fastifyJwt, {
	secret: env.JWT_SECRET,
	cookie: {// Configura a procura do token
		cookieName: 'refreshToken',
		signed: false,
	},
	sign: {// Configura a criação do token
		expiresIn: '10m',//10 minutes
	},
})
app.register(fastifyCookie)

app.register(fastifyMultipart)

app.register(orgsRoutes)
app.register(petsRoutes)

app.setErrorHandler((error, _request, reply) => {
	if (error instanceof ZodError) {
		return reply 
			.status(400)
			.send({
				message: 'Validation error.',
				issues: z.prettifyError(error),
			})
	}

	return reply.status(500).send({
		message: 'Internal server error.',
	})
})