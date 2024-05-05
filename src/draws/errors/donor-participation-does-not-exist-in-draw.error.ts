import { DomainError } from "../../shared/domain.error";

export class DonorParticipationDoesNotExistInDrawError extends DomainError {
  constructor() {
    super("Donor participation does not exist in the draw");
  }
}
