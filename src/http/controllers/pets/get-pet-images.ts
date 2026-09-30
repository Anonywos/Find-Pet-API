import { PetImagesPrismaRepository } from '@/repositories/prisma/pet-images-prisma-repository.js'
import { petsPrismaRepository } from '@/repositories/prisma/pets-prisma-repository.js'
import { ResourceNotFoundError } from '@/services/errors/ResourceNotFoundError.js'
import { getPetImagesUseCase } from '@/services/get-pet-images.js'
import type { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'


export async function getPetImages (request: FastifyRequest, reply: FastifyReply) {
	const getPetImagesSchema = z.object({ 
		id: z.string(), 
	})

	const {
		id,
	} = getPetImagesSchema.parse(request.params)

	try {
		const petsRepository = new petsPrismaRepository()
		const petImagesRepository = new PetImagesPrismaRepository()
		const useCase = new getPetImagesUseCase(petsRepository, petImagesRepository)

		const petImages = await useCase.execute({
			petId: id,
		})

		return reply.status(200).send({
			petImages,
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