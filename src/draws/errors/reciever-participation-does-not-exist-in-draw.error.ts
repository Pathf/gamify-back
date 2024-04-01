export class RecieverParticipationDoesNotExistInDrawError extends Error {
  constructor() {
    super("Reciever participation does not exist in the draw");
  }
}
