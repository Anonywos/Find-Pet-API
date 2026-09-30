import type { FastifyReply, FastifyRequest } from 'fastify'


export default async function verifyJWT(request: FastifyRequest, reply: FastifyReply) {
	try {
		await request.jwtVerify()
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	} catch (e) {
		return reply.status(401).send({
			message: 'Unauthorized',
		})
	}
}