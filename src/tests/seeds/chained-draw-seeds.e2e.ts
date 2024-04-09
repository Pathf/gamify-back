import { testChainedDraws } from "../../draws/tests/chained-draw-seeds";
import { ChainedDrawFixture } from "../fixtures/chained-draw-fixture";

export const e2eChainedDraws = {
  aliceToBobSecretSanta: new ChainedDrawFixture(
    testChainedDraws.aliceToBobSecretSanta,
  ),
  bobToCharlesSecretSanta: new ChainedDrawFixture(
    testChainedDraws.bobToCharlesSecretSanta,
  ),
  charlesToDavidSecretSanta: new ChainedDrawFixture(
    testChainedDraws.charlesToDavidSecretSanta,
  ),
  davidToAliceSecretSanta: new ChainedDrawFixture(
    testChainedDraws.davidToAliceSecretSanta,
  ),
};
