import { DomainError } from "../../shared/domain.error";

export class OnlyOrganizerCanRunDrawError extends DomainError {
  constructor() {
    super("Only the organizer can run the draw");
  }
}
