export class OrgAlreadyExistsError extends Error {
	constructor() {
		super('Organization with this e-mail already exists.')
	}
}