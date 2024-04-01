import { testParticipations } from "../../draws/tests/participation-seeds";
import { ParticipationFixture } from "../fixtures/participation-fixture";

export const e2eParticipations = {
  aliceSecretSanta: new ParticipationFixture(
    testParticipations.aliceInSecretSanta,
  ),
  bobSecretSanta: new ParticipationFixture(testParticipations.bobInSecretSanta),
  charlesSecretSanta: new ParticipationFixture(
    testParticipations.charlesInSecretSanta,
  ),
};
