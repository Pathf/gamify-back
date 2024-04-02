import { testConditions } from "../../draws/tests/condition-seeds";
import { ConditionFixture } from "../fixtures/condition-fixture";

export const e2eConditions = {
  aliceEqualBobInSecretSanta: new ConditionFixture(
    testConditions.aliceEqualBobInSecretSanta,
  ),
  aliceToBobInSecretSanta: new ConditionFixture(
    testConditions.aliceToBobInSecretSanta,
  ),
};
