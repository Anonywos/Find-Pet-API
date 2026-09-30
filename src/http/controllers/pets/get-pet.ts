import { petsPrismaRepository } from '@/repositories/prisma/pets-prisma-repository.js'
import { ResourceNotFoundError } from '@/services/errors/ResourceNotFoundError.js'
import { getPetUseCase } from '@/services/get-pet.js'
import type { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'


export async function getPet (request: FastifyRequest, reply: FastifyReply) {
	const getPetSchema = z.object({ 
		id: z.string(), 
	})

	const {
		id,
	} = getPetSchema.parse(request.params)

	try {
		const petsRepository = new petsPrismaRepository()
		const useCase = new getPetUseCase(petsRepository)

		const pet = await useCase.execute({
			petId: id,
		})

		return reply.status(200).send({
			pet: {
				...pet,
			},
		})
	} catch (e) {
		if (e instanceof ResourceNotFoundError) {
			return reply.status(404).send({
				message: e.message,
			})
		}
		throw e
	}
}