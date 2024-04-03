export class DrawMustHaveLeastThreeParticipantsError extends Error {
  constructor() {
    super("Draw must have at least 3 participants");
  }
}
