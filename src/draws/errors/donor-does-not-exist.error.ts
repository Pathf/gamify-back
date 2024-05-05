import { DomainError } from "../../shared/domain.error";

export class DonorDoesNotExistError extends DomainError {
  constructor() {
    super("Donor does not exist");
  }
}
