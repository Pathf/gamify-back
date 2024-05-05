import { DomainError } from "../../shared/domain.error";

export class OrganizerDoesNotExistError extends DomainError {
  constructor() {
    super("Organizer does not exist");
  }
}
