export class ParticipantAlreadyExistError extends Error {
  constructor() {
    super("Participant is already registered");
  }
}
