import 'dotenv/config'
import z from 'zod'


const envSchema = z.object({
	NODE_ENV: z.enum(['dev', 'test', 'production']).default('dev'),
	DATABASE_URL: z.string(),
	JWT_SECRET: z.string(),
	PORT: z.coerce.number().default(3333),
})

function getEnv () {
	const _env = envSchema.safeParse(process.env) //need @types/node

	if (_env.success === false) {
		console.error('Invalid environment variables', z.treeifyError(_env.error))
		throw new Error('Invalid environment variables')
	}

	return _env.data
}

export const env = getEnv()