export class OnlyOrganizerCanCancelConditionError extends Error {
  constructor() {
    super("Only organizer can cancel condition");
  }
}
