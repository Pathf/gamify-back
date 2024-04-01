export class OnlyOrganizerCanRegisterConditionError extends Error {
  constructor() {
    super("Only the organizer can register a condition");
  }
}
