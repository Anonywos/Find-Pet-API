import { Age, Energy, Environment, Independence, Size } from '@/generated/prisma/enums.js'
import { OrgsPrismaRepository } from '@/repositories/prisma/orgs-prisma-repository.js'
import { petsPrismaRepository } from '@/repositories/prisma/pets-prisma-repository.js'
import { CreatePetUseCase } from '@/services/create-pet.js'
import { ResourceNotFoundError } from '@/services/errors/ResourceNotFoundError.js'
import type { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'


export async function createPet (request: FastifyRequest, reply: FastifyReply) {
	const createPetSchema = z.object({ 
		name: z.string(), 
		description: z.string().nullable(), 
		age: z.enum(Age), 
		energy: z.enum(Energy), 
		size: z.enum(Size), 
		independence: z.enum(Independence), 
		environment: z.enum(Environment), 
		requirements: z.array(z.string()),
	})

	const {
		name, 
		description, 
		age, 
		energy, 
		size, 
		independence, 
		environment, 
		requirements,
	} = createPetSchema.parse(request.body)

	try {
		const orgsRepository = new OrgsPrismaRepository()
		const petsRepository = new petsPrismaRepository()
		const useCase = new CreatePetUseCase(petsRepository, orgsRepository)

		await useCase.execute({
			orgId: request.user.sign.sub,
			name, 
			description, 
			age, 
			energy, 
			size, 
			independence, 
			environment, 
			requirements,
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