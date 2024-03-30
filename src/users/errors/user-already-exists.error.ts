export class UserAlreadyExistsError extends Error {
  constructor() {
    super("User already exists with this e-mail address");
  }
}
