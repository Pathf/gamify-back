export class NotAllowedUpdateDrawError extends Error {
  constructor() {
    super("You are not allowed to update this draw");
  }
}
