import * as request from "supertest";
import {
  IConditionRepository,
  I_CONDITION_REPOSITORY,
} from "../draws/ports/condition-repositroy.interface";
import { e2eDraws } from "./seeds/draw-seeds.e2e";
import { e2eParticipations } from "./seeds/participation-seeds.e2e";
import { e2eUsers } from "./seeds/user-seeds.e2e";
import { TestApp } from "./utils/test-app";

describe("Feature: Registering condition", () => {
  const drawId = e2eDraws.secretSanta.entity.props.id;
  const donorId = e2eUsers.alice.entity.props.id;
  const receiverId = e2eUsers.bob.entity.props.id;
  const isViceVersa = false;
  const payload = {
    donorId,
    receiverId,
    isViceVersa,
  };

  let app: TestApp;
  let conditionRepository: IConditionRepository;

  beforeEach(async () => {
    app = new TestApp();
    await app.setup();
    await app.loadFixture([
      e2eUsers.alice,
      e2eUsers.bob,
      e2eUsers.charles,
      e2eDraws.secretSanta,
      e2eParticipations.aliceSecretSanta,
      e2eParticipations.bobSecretSanta,
      e2eParticipations.charlesSecretSanta,
    ]);

    conditionRepository = app.get<IConditionRepository>(I_CONDITION_REPOSITORY);
  });

  afterEach(async () => {
    await app.cleanup();
  });

  describe("Scenario: happy path", () => {
    it("should register the condition at the draw", async () => {
      const result = await request(app.getHttpServer())
        .post(`/draw/${drawId}/condition`)
        .set("Authorization", e2eUsers.alice.creaetAuthorizationToken())
        .send(payload);
      expect(result.status).toBe(201);

      const conditions = await conditionRepository.findAllByDrawId(drawId);
      expect(conditions).toHaveLength(1);
      expect(conditions[0].props).toEqual({
        id: expect.any(String),
        drawId,
        donorId,
        receiverId,
        isViceVersa,
      });
    });
  });

  describe("Scenario: the user is not authenticated", () => {
    it("should reject", async () => {
      const result = await request(app.getHttpServer())
        .post(`/draw/${drawId}/condition`)
        .send(payload);
      expect(result.status).toBe(401);

      const conditions = await conditionRepository.findAllByDrawId(drawId);
      expect(conditions).toEqual([]);
    });
  });
});
