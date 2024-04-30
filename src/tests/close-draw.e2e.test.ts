import * as request from "supertest";
import {
  IDrawRepository,
  I_DRAW_REPOSITORY,
} from "../draws/ports/draw-repository.interace";
import { testDraws } from "../draws/tests/draw-seeds";
import { e2eChainedDraws } from "./seeds/chained-draw-seeds.e2e";
import { e2eDraws } from "./seeds/draw-seeds.e2e";
import { e2eUsers } from "./seeds/user-seeds.e2e";
import { TestApp } from "./utils/test-app";

describe("Feature: Closing draw", () => {
  const drawId = e2eDraws.secretSanta.entity.props.id;

  let app: TestApp;
  let drawRepository: IDrawRepository;

  beforeEach(async () => {
    app = new TestApp();
    await app.setup();
    await app.loadFixture([
      e2eUsers.alice,
      e2eDraws.secretSanta,
      e2eChainedDraws.aliceToBobSecretSanta,
    ]);
    drawRepository = app.get<IDrawRepository>(I_DRAW_REPOSITORY);
  });

  afterEach(async () => {
    await app.cleanup();
  });

  describe("Scenario: happy path", () => {
    it("should close draw", async () => {
      const result = await request(app.getHttpServer())
        .get(`/draw/${drawId}/close`)
        .set("Authorization", e2eUsers.alice.createAuthorizationToken());
      expect(result.status).toBe(200);

      const draw = await drawRepository.findOne(drawId);
      expect(draw).toBeDefined();
      expect(draw?.props).toEqual({
        ...testDraws.secretSanta.props,
        isFinish: true,
      });
    });
  });

  describe("Scenario: the user is not authenticated", () => {
    it("should reject", async () => {
      const result = await request(app.getHttpServer()).get(
        `/draw/${drawId}/close`,
      );
      expect(result.status).toBe(401);

      const draw = await drawRepository.findOne(drawId);
      expect(draw).toBeDefined();
      expect(draw?.props).toEqual(testDraws.secretSanta.props);
    });
  });
});
