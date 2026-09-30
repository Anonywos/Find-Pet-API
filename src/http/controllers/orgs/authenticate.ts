

import { OrgsPrismaRepository } from '@/repositories/prisma/orgs-prisma-repository.js'
import { AuthenticateUseCase } from '@/services/authenticate.js'
import { InvalidCredentialsError } from '@/services/errors/InvalidCredentialsError.js'
import { ResourceNotFoundError } from '@/services/errors/ResourceNotFoundError.js'
import type { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'


export async function authenticate (request: FastifyRequest, reply: FastifyReply) {
	const authenticateSchema = z.object({
		email: z.string(),
		password: z.string(),
	})

	const {
		email,
		password,
	} = authenticateSchema.parse(request.body)

	try {
		const repository = new OrgsPrismaRepository()
		const useCase = new AuthenticateUseCase(repository)

		const org = await useCase.execute({
			email,
			password,
		})

		const token = await reply.jwtSign(
			{
				sign: {
					sub: org.id,
				},
			},
		)

		const refreshToken = await reply.jwtSign(
			{
				sign: {
					sub: org.id,
					expiresIn: '7d',//7 days
				},
			},
		)

		return reply
			.setCookie('refreshToken', refreshToken, {
				path: '/',
				secure: true,
				sameSite: true,
				httpOnly: true,
			})
			.status(200)
			.send({
				token,
			})

	} catch (e) {
		if (e instanceof ResourceNotFoundError) {
			return reply.status(404).send({
				message: e.message,
			})
		}
		if (e instanceof InvalidCredentialsError) {
			return reply.status(400).send({
				message: e.message,
			})
		}
		throw e
	}
}