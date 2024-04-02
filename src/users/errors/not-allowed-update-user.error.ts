export class NotAllowedUpdateUserError extends Error {
  constructor() {
    super("You are not allowed to update this user");
  }
}
