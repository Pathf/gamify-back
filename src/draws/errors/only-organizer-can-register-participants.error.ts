import { DomainError } from "../../shared/domain.error";

export class OnlyOrganizerCanRegisterParticipantsError extends DomainError {
  constructor() {
    super("Only the organizer can register participants");
  }
}
