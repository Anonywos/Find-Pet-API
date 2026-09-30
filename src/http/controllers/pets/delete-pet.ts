import { petsPrismaRepository } from '@/repositories/prisma/pets-prisma-repository.js'
import { DeletePetUseCase } from '@/services/delete-pet.js'
import { ResourceNotFoundError } from '@/services/errors/ResourceNotFoundError.js'
import type { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'


export async function deletePet (request: FastifyRequest, reply: FastifyReply) {
	const deletePetSchema = z.object({ 
		id: z.string(), 
	})

	const {
		id,
	} = deletePetSchema.parse(request.params)

	try {
		const petsRepository = new petsPrismaRepository()
		const useCase = new DeletePetUseCase(petsRepository)

		await useCase.execute({
			petId: id,
		})

		return reply.status(204).send()
	} catch (e) {
		if (e instanceof ResourceNotFoundError) {
			return reply.status(404).send({
				message: e.message,
			})
		}
		throw e
	}
}