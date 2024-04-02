export class ConditionDoesNotExistError extends Error {
  constructor() {
    super("Condition does not exist");
  }
}
