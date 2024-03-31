export class OnlyOrganizerCanCancelParticipationError extends Error {
  constructor() {
    super("Only the organizer can cancel a participation");
  }
}
