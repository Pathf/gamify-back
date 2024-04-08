import * as request from "supertest";
import {
  IChainedDrawRepository,
  I_CHAINED_DRAW_REPOSITORY,
} from "../draws/ports/chained-draw-repository.interface";
import { e2eConditions } from "./seeds/condition-seeds.e2e";
import { e2eDraws } from "./seeds/draw-seeds.e2e";
import { e2eParticipations } from "./seeds/participation-seeds.e2e";
import { e2eUsers } from "./seeds/user-seeds.e2e";
import { TestApp } from "./utils/test-app";

describe("Feature: Running draw", () => {
  async function getChainedDraws() {
    return await chainedDrawRepository.findByDrawId(drawId);
  }
  const drawId = e2eDraws.secretSanta.entity.props.id;

  let app: TestApp;
  let chainedDrawRepository: IChainedDrawRepository;

  beforeEach(async () => {
    app = new TestApp();
    await app.setup();
    await app.loadFixture([
      e2eUsers.alice,
      e2eUsers.bob,
      e2eUsers.charles,
      e2eUsers.david,
      e2eDraws.secretSanta,
      e2eParticipations.aliceSecretSanta,
      e2eParticipations.bobSecretSanta,
      e2eParticipations.charlesSecretSanta,
      e2eParticipations.davidSecretSanta,
      e2eConditions.aliceEqualBobInSecretSanta,
    ]);
    chainedDrawRepository = app.get<IChainedDrawRepository>(
      I_CHAINED_DRAW_REPOSITORY,
    );
  });

  afterEach(async () => {
    await app.cleanup();
  });

  describe("Scenario: happy path", () => {
    it("should run draw", async () => {
      const result = await request(app.getHttpServer())
        .get(`/draw/${drawId}/run`)
        .set("Authorization", e2eUsers.alice.creaetAuthorizationToken());
      expect(result.status).toBe(200);

      const chainedDraws = await getChainedDraws();
      expect(chainedDraws).toHaveLength(4);
    });
  });

  describe("Scenario: the user is not authenticated", () => {
    it("should reject", async () => {
      const result = await request(app.getHttpServer()).get(
        `/draw/${drawId}/run`,
      );
      expect(result.status).toBe(401);

      const chainedDraws = await getChainedDraws();
      expect(chainedDraws).toHaveLength(0);
    });
  });
});
