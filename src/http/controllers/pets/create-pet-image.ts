import { PetImagesPrismaRepository } from '@/repositories/prisma/pet-images-prisma-repository.js'
import { petsPrismaRepository } from '@/repositories/prisma/pets-prisma-repository.js'
import { CreatePetImageUseCase } from '@/services/create-pet-image.js'
import { ResourceNotFoundError } from '@/services/errors/ResourceNotFoundError.js'
import fastifyMultipart from '@fastify/multipart'
import type { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'


export async function createPetImage (request: FastifyRequest, reply: FastifyReply) {
	const createPetImageSchema = z.object({ 
		id: z.uuid(),
	})
	const fileSchema = z.object({
		filename: z.string().min(1),
		mimetype: z.enum([
			'image/png',
			'image/jpeg',
		]),
	})

	const {
		id,
	} = createPetImageSchema.parse(request.params)

	let fileImage: fastifyMultipart.MultipartFile | undefined

	try {
		fileImage = await request.file()
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	} catch (e) {
		return reply.status(400).send({
			message: 'Image file is required.',
		})
	}

	if (!fileImage) {
		return reply.status(400).send({
			message: 'Image file is required.',
		})
	}

	const { filename, mimetype } = fileSchema.parse({
		filename: fileImage.filename,
		mimetype: fileImage.mimetype,
	})

	const buffer = await fileImage.toBuffer()
	const convertedBuffer = new Uint8Array(buffer)

	try {
		const petImagesRepository = new PetImagesPrismaRepository()
		const petsRepository = new petsPrismaRepository()
		const useCase = new CreatePetImageUseCase(petImagesRepository, petsRepository)

		await useCase.execute({
			file_name: filename,
			mime_type: mimetype,
			data: convertedBuffer,
			petId: id,
		})

		return reply.status(201).send()
	} catch (e) {
		if (e instanceof ResourceNotFoundError) {
			return reply.status(404).send({
				message: e.message,
			})
		}
		throw e
	}
}