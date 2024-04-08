import * as request from "supertest";
import {
  IParticipationRepository,
  I_PARTICIPATION_REPOSITORY,
} from "../draws/ports/participation-repository.interface";
import { e2eDraws } from "./seeds/draw-seeds.e2e";
import { e2eUsers } from "./seeds/user-seeds.e2e";
import { TestApp } from "./utils/test-app";

describe("Feature: Registering participation", () => {
  async function getParticipations() {
    return await participationRepository.findAllParticipationByDrawId(
      e2eDraws.secretSanta.entity.props.id,
    );
  }
  const drawId = e2eDraws.secretSanta.entity.props.id;

  let app: TestApp;
  let participationRepository: IParticipationRepository;

  beforeEach(async () => {
    app = new TestApp();
    await app.setup();
    await app.loadFixture([e2eUsers.alice, e2eDraws.secretSanta]);
    participationRepository = app.get<IParticipationRepository>(
      I_PARTICIPATION_REPOSITORY,
    );
  });

  afterEach(async () => {
    await app.cleanup();
  });

  describe("Scenario: happy path", () => {
    it("should register the participant at the draw", async () => {
      const result = await request(app.getHttpServer())
        .post(`/draw/${drawId}/participation`)
        .set("Authorization", e2eUsers.alice.creaetAuthorizationToken())
        .send({ participantId: e2eUsers.alice.entity.props.id });
      expect(result.status).toBe(201);

      const participations = await getParticipations();
      expect(participations).toHaveLength(1);
      expect(participations[0].props).toEqual({
        drawId: e2eDraws.secretSanta.entity.props.id,
        participantId: e2eUsers.alice.entity.props.id,
      });
    });
  });

  describe("Scenario: the user is not authenticated", () => {
    it("should reject", async () => {
      const result = await request(app.getHttpServer())
        .post(`/draw/${drawId}/participation`)
        .send({ participantId: e2eUsers.alice.entity.props.id });
      expect(result.status).toBe(401);

      const participations = await getParticipations();
      expect(participations).toEqual([]);
    });
  });
});
