export class OnlyOrganizerCanRunDrawError extends Error {
  constructor() {
    super("Only the organizer can run the draw");
  }
}
