import { DomainError } from "../../shared/domain.error";

export class OnlyOrganizerCanCancelConditionError extends DomainError {
  constructor() {
    super("Only organizer can cancel condition");
  }
}
