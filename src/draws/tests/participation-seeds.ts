import { testUsers } from "../../users/tests/user-seeds";
import { Participation } from "../entities/participation.entity";
import { testDraws } from "./draw-seeds";

export const testParticipations = {
  aliceInSecretSanta: new Participation({
    drawId: testDraws.secretSanta.props.id,
    participantId: testUsers.alice.props.id,
  }),
  bobInSecretSanta: new Participation({
    drawId: testDraws.secretSanta.props.id,
    participantId: testUsers.bob.props.id,
  }),
  charlesInSecretSanta: new Participation({
    drawId: testDraws.secretSanta.props.id,
    participantId: testUsers.charles.props.id,
  }),
  aliceInTombola: new Participation({
    drawId: testDraws.tombola.props.id,
    participantId: testUsers.alice.props.id,
  }),
  bobInTombola: new Participation({
    drawId: testDraws.tombola.props.id,
    participantId: testUsers.bob.props.id,
  }),
};
