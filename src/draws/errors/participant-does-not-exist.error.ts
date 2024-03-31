export class ParticipantDoesNotExistError extends Error {
  constructor() {
    super("Participant does not exist");
  }
}
