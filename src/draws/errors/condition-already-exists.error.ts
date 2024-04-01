export class ConditionAlreadyExistsError extends Error {
  constructor() {
    super("Condition already exists");
  }
}
