import { Client } from 'pg'

export default async function cleanDatabase() {
	if (!process.env.DATABASE_URL_TEST) {
		throw new Error('Please provide a DATABASE_URL_TEST env variable')
	}

	const client = new Client({
		connectionString: process.env.DATABASE_URL_TEST,
	})

	await client.connect()

	try {
		const databaseResult = await client.query<{
			current_database: string
		}>('SELECT current_database()')

		const currentDatabase = databaseResult.rows[0]?.current_database

		if (currentDatabase !== 'findAFriendApi_test') {
			throw new Error(
				`Refusing to clean database "${currentDatabase}". Expected "findAFriendApi_test".`,
			)
		}

		await client.query(`
			TRUNCATE TABLE
				"orgs",
				"pets",
				"pet_images"
			RESTART IDENTITY CASCADE
		`)
	} finally {
		await client.end()
	}
}