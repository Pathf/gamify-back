import { DomainError } from "../../shared/domain.error";

export class OnlyOrganizerCanRegisterConditionError extends DomainError {
  constructor() {
    super("Only the organizer can register a condition");
  }
}
