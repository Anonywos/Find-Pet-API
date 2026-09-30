import 'dotenv/config'
import { execSync } from 'node:child_process'
import type { Environment } from 'vitest/environments'
import cleanDatabase from './clean-database.js'



export default <Environment>{
	name: 'prisma',
	viteEnvironment: 'ssr',

	async setup() {
		if (!process.env.DATABASE_URL_TEST) {
			throw new Error('Please provide a DATABASE_URL_TEST env variable')
		}

		process.env.NODE_ENV = 'test'
		process.env.DATABASE_URL = process.env.DATABASE_URL_TEST

		execSync('npx prisma db push --force-reset', {
			stdio: 'inherit',
			env: {
				...process.env,
				DATABASE_URL: process.env.DATABASE_URL_TEST,
			},
		})

		await cleanDatabase()

		return {
			async teardown() {
				await cleanDatabase()
			},
		}
	},
}