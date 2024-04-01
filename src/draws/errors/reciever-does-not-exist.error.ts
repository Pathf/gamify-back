export class RecieverDoesNotExistError extends Error {
  constructor() {
    super("Receiver does not exist");
  }
}
