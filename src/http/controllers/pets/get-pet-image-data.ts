import { PetImagesPrismaRepository } from '@/repositories/prisma/pet-images-prisma-repository.js'
import { ResourceNotFoundError } from '@/services/errors/ResourceNotFoundError.js'
import { getPetImageDataUseCase } from '@/services/get-pet-image-data.js'
import type { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'


export async function getPetImageData (request: FastifyRequest, reply: FastifyReply) {
	const getPetImageDataSchema = z.object({ 
		id: z.string(), 
	})

	const {
		id,
	} = getPetImageDataSchema.parse(request.params)

	try {
		const petImagesRepository = new PetImagesPrismaRepository()
		const useCase = new getPetImageDataUseCase(petImagesRepository)

		const petImageData = await useCase.execute({
			imageId: id,
		})

		return reply.status(200)
			.type(petImageData.mime_type)
			.send(Buffer.from(petImageData.data))
	} catch (e) {
		if (e instanceof ResourceNotFoundError) {
			return reply.status(404).send({
				message: e.message,
			})
		}
		throw e
	}
}