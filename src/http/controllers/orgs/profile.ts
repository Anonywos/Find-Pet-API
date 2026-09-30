import { OrgsPrismaRepository } from '@/repositories/prisma/orgs-prisma-repository.js'
import { ResourceNotFoundError } from '@/services/errors/ResourceNotFoundError.js'
import { ProfileUseCase } from '@/services/profile.js'
import type { FastifyReply, FastifyRequest } from 'fastify'


export async function profile (request: FastifyRequest, reply: FastifyReply) {
	try {
		const id = request.user.sign.sub
		const repository = new OrgsPrismaRepository()
		const useCase = new ProfileUseCase(repository)

		const org = await useCase.execute({id})

		return reply.status(200)
			.send({
				org: {
					...org,
					password_hash: undefined,
				},
			})
	} catch (e) {
		if (e instanceof ResourceNotFoundError) {
			return reply.status(404)
				.send({
					message: e.message,
				})
		}
		throw e
	}
}