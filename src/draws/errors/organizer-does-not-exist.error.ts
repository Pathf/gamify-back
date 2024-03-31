export class OrganizerDoesNotExistError extends Error {
  constructor() {
    super("Organizer does not exist");
  }
}
