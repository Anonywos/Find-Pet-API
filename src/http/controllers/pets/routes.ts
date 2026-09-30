import verifyJWT from '@/http/middlewares/verify-jwt.js'
import type { FastifyInstance } from 'fastify'
import { createPetImage } from './create-pet-image.js'
import { createPet } from './create-pet.js'
import { filterPets } from './filter-pets.js'
import { getPetImageData } from './get-pet-image-data.js'
import { getPetImages } from './get-pet-images.js'
import { getPet } from './get-pet.js'


export async function petsRoutes(app:FastifyInstance) {
	app.post('/pets', {onRequest: verifyJWT}, createPet)
	app.get('/pets', {onRequest: verifyJWT}, filterPets)
	app.get('/pets/:id', {onRequest: verifyJWT}, getPet)
	// Images
	app.post('/pets/:id/images', {onRequest: verifyJWT}, createPetImage)
	app.get('/pets/:id/images', {onRequest: verifyJWT}, getPetImages)
	app.get('/pets/images/:id', {onRequest: verifyJWT}, getPetImageData)
}