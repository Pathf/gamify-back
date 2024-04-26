import { testDraws } from "../../draws/tests/draw-seeds";
import { DrawFixture } from "../fixtures/draw-fixture";

export const e2eDraws = {
  secretSanta: new DrawFixture(testDraws.secretSanta),
  tombola: new DrawFixture(testDraws.tombola),
  drawIsAlreadyOver: new DrawFixture(testDraws.drawIsAlreadyOver),
};
