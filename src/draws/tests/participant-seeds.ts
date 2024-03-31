import { testUsers } from "../../users/tests/user-seeds";
import { Participation } from "../entities/participation.entity";
import { testDraws } from "./draw-seeds";

export const testParticipants = {
  aliceInSecretSanta: new Participation({
    drawId: testDraws.secretSanta.props.id,
    participantId: testUsers.alice.props.id,
  }),
};
