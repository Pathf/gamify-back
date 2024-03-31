export class OnlyOrganizerCanRegisterParticipantsError extends Error {
  constructor() {
    super("Only the organizer can register participants");
  }
}
