export class ConditionPreventsNotDrawError extends Error {
  constructor() {
    super("Condition prevents the draw");
  }
}
