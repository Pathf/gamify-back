import { testUsers } from "../../users/tests/user-seeds";
import { Condition } from "../entities/condition.entity";
import { testDraws } from "./draw-seeds";

export const testConditions = {
  aliceToBobInSecretSanta: new Condition({
    drawId: testDraws.secretSanta.props.id,
    donorId: testUsers.alice.props.id,
    receiverId: testUsers.bob.props.id,
    isViceVersa: false,
  }),
  aliceEqualBobInSecretSanta: new Condition({
    drawId: testDraws.secretSanta.props.id,
    donorId: testUsers.alice.props.id,
    receiverId: testUsers.bob.props.id,
    isViceVersa: true,
  }),
};
