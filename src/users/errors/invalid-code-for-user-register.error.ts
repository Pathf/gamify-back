export class InvalidCodeForUserRegisterError extends Error {
  constructor() {
    super("Invalid code for user register");
  }
}
