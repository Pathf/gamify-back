import { DomainError } from "../../shared/domain.error";

export class DrawMustHaveLeastThreeParticipantsError extends DomainError {
  constructor() {
    super("Draw must have at least 3 participants");
  }
}
