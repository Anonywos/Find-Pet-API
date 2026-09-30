import { Age, Energy, Environment, Independence, Size } from '@/generated/prisma/enums.js'
import { petsPrismaRepository } from '@/repositories/prisma/pets-prisma-repository.js'
import { FilterPetsUseCase } from '@/services/filter-pets.js'
import type { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'


export async function filterPets (request: FastifyRequest, reply: FastifyReply) {
	const filterPetsSchema = z.object({ 
		city: z.string(),
		age: z.enum(Age).optional(),
		energy: z.enum(Energy).optional(),
		size: z.enum(Size).optional(),
		independence: z.enum(Independence).optional(),
		environment: z.enum(Environment).optional(),
		page: z.coerce.number().optional(),
	})

	const {
		city,
		age,
		energy,
		size,
		independence,
		environment,
		page,
	} = filterPetsSchema.parse(request.query)

	const petsRepository = new petsPrismaRepository()
	const useCase = new FilterPetsUseCase(petsRepository)

	const pets = await useCase.execute({
		filters: {
			city,
			age,
			energy,
			size,
			independence,
			environment,
		},
		page,
	})

	return reply.status(200).send({
		pets: {
			pets: pets.pets,
			totalPets: pets.totalPets,
		},
	})
}