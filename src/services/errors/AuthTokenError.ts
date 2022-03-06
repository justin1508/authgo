export class AuthOTokenError extends Error {
	constructor() {
		super("Error with authentication token.");
	}
}