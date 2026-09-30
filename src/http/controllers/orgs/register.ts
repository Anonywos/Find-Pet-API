import { OrgsPrismaRepository } from '@/repositories/prisma/orgs-prisma-repository.js'
import { OrgAlreadyExistsError } from '@/services/errors/OrgAlreadyExistError.js'
import { RegisterUseCase } from '@/services/register.js'
import type { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'


export async function register (request: FastifyRequest, reply: FastifyReply) {
	const registerOrgSchema = z.object({
		name: z.string(),
		owner: z.string().nullable(),
		email: z.string(),
		zip_code: z.string(),
		address: z.string(),
		city: z.string(),
		phone: z.string(),
		password: z.string()
			.min(6, 'The password must have more than 6 characters')
			.regex(/[a-z]/, 'The password must contain a lowercase letter')
			.regex(/[A-Z]/, 'The password must contain a uppercase letter')
			.regex(/[^a-zA-Z0-9]/, 'The password must contain a special character'),
	})

	const {
		name,
		owner,
		email,
		zip_code,
		address,
		city,
		phone,
		password,
	} = registerOrgSchema.parse(request.body)

	try {
		const repository = new OrgsPrismaRepository()
		const register = new RegisterUseCase(repository)

		await register.execute({
			name,
			owner,
			email,
			zip_code,
			address,
			city,
			phone,
			password,
		})
	} catch (e) {
		if (e instanceof OrgAlreadyExistsError) {
			return reply.status(409).send({
				message: e.message,
			})
		}
		throw e
	}
	
	return reply.status(201).send()
}