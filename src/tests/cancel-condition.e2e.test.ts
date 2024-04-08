import * as request from "supertest";
import {
  IConditionRepository,
  I_CONDITION_REPOSITORY,
} from "../draws/ports/condition-repositroy.interface";
import { e2eConditions } from "./seeds/condition-seeds.e2e";
import { e2eDraws } from "./seeds/draw-seeds.e2e";
import { e2eUsers } from "./seeds/user-seeds.e2e";
import { TestApp } from "./utils/test-app";

describe("Feature: Canceling condition", () => {
  const drawId = e2eDraws.secretSanta.entity.props.id;
  const conditionId = e2eConditions.aliceToBobInSecretSanta.entity.props.id;

  let app: TestApp;
  let conditionRepository: IConditionRepository;

  beforeEach(async () => {
    app = new TestApp();
    await app.setup();
    await app.loadFixture([
      e2eUsers.alice,
      e2eDraws.secretSanta,
      e2eConditions.aliceToBobInSecretSanta,
    ]);
    conditionRepository = app.get<IConditionRepository>(I_CONDITION_REPOSITORY);
  });

  afterEach(async () => {
    await app.cleanup();
  });

  describe("Scenario: happy path", () => {
    it("should delete the condition", async () => {
      const result = await request(app.getHttpServer())
        .delete(`/draw/${drawId}/condition/${conditionId}`)
        .set("Authorization", e2eUsers.alice.creaetAuthorizationToken());
      expect(result.status).toBe(200);

      const condition = await conditionRepository.findById(conditionId);
      expect(condition).toBeNull();
    });
  });

  describe("Scenario: the user is not authenticated", () => {
    it("should reject", async () => {
      const result = await request(app.getHttpServer()).delete(
        `/draw/${drawId}/condition/${conditionId}`,
      );
      expect(result.status).toBe(403);

      const condition = await conditionRepository.findById(conditionId);
      expect(condition).toEqual(e2eConditions.aliceToBobInSecretSanta.entity);
    });
  });
});
