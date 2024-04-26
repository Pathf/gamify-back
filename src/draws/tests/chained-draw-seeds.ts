import { testUsers } from "../../users/tests/user-seeds";
import { ChainedDraw } from "../entities/chained-draw.entity";
import { testDraws } from "./draw-seeds";

export const testChainedDraws = {
  aliceToBobSecretSanta: new ChainedDraw({
    drawId: testDraws.secretSanta.props.id,
    donorId: testUsers.alice.props.id,
    receiverId: testUsers.bob.props.id,
    dateDraw: new Date("2024-01-01T00:00:00.000Z"),
  }),
  bobToCharlesSecretSanta: new ChainedDraw({
    drawId: testDraws.secretSanta.props.id,
    donorId: testUsers.bob.props.id,
    receiverId: testUsers.charles.props.id,
    dateDraw: new Date("2024-01-01T00:00:00.000Z"),
  }),
  charlesToDavidSecretSanta: new ChainedDraw({
    drawId: testDraws.secretSanta.props.id,
    donorId: testUsers.charles.props.id,
    receiverId: testUsers.david.props.id,
    dateDraw: new Date("2024-01-01T00:00:00.000Z"),
  }),
  davidToAliceSecretSanta: new ChainedDraw({
    drawId: testDraws.secretSanta.props.id,
    donorId: testUsers.david.props.id,
    receiverId: testUsers.alice.props.id,
    dateDraw: new Date("2024-01-01T00:00:00.000Z"),
  }),
  aliceToCharlesDrawIsAlreadyOver: new ChainedDraw({
    drawId: testDraws.drawIsAlreadyOver.props.id,
    donorId: testUsers.alice.props.id,
    receiverId: testUsers.charles.props.id,
    dateDraw: new Date("2020-01-01T00:00:00.000Z"),
  }),
};
