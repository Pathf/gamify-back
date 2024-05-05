import { DomainError } from "../../shared/domain.error";

export class OnlyOrganizerCanCancelParticipationError extends DomainError {
  constructor() {
    super("Only the organizer can cancel a participation");
  }
}
