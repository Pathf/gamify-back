import { testUsers } from "../../users/tests/user-seeds";
import { Condition } from "../entities/condition.entity";
import { testDraws } from "./draw-seeds";

export const testConditions = {
  aliceToBobInSecretSanta: new Condition({
    id: "alice-to-bob-in-secret-santa-id",
    drawId: testDraws.secretSanta.props.id,
    donorId: testUsers.alice.props.id,
    receiverId: testUsers.bob.props.id,
    isViceVersa: false,
  }),
  aliceEqualBobInSecretSanta: new Condition({
    id: "alice-equal-bob-in-secret-santa-id",
    drawId: testDraws.secretSanta.props.id,
    donorId: testUsers.alice.props.id,
    receiverId: testUsers.bob.props.id,
    isViceVersa: true,
  }),
  aliceEqualCharlesInSecretSanta: new Condition({
    id: "alice-equal-charles-in-secret-santa-id",
    drawId: testDraws.secretSanta.props.id,
    donorId: testUsers.alice.props.id,
    receiverId: testUsers.charles.props.id,
    isViceVersa: true,
  }),
  aliceToBobInTombola: new Condition({
    id: "alice-to-bob-in-tombola-id",
    drawId: testDraws.tombola.props.id,
    donorId: testUsers.alice.props.id,
    receiverId: testUsers.bob.props.id,
    isViceVersa: false,
  }),
};
