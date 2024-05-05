import { DomainError } from "../../shared/domain.error";

export class ParticipantAlreadyExistError extends DomainError {
  constructor() {
    super("Participant is already registered");
  }
}
