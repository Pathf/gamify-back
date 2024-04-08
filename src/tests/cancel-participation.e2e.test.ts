import * as request from "supertest";
import {
  IParticipationRepository,
  I_PARTICIPATION_REPOSITORY,
} from "../draws/ports/participation-repository.interface";
import { e2eDraws } from "./seeds/draw-seeds.e2e";
import { e2eParticipations } from "./seeds/participation-seeds.e2e";
import { e2eUsers } from "./seeds/user-seeds.e2e";
import { TestApp } from "./utils/test-app";

describe("Feature: Canceling participation", () => {
  const drawId = e2eDraws.secretSanta.entity.props.id;
  const participantId = e2eUsers.alice.entity.props.id;

  let app: TestApp;
  let participationRepository: IParticipationRepository;

  beforeEach(async () => {
    app = new TestApp();
    await app.setup();
    await app.loadFixture([
      e2eUsers.alice,
      e2eDraws.secretSanta,
      e2eParticipations.aliceSecretSanta,
    ]);
    participationRepository = app.get<IParticipationRepository>(
      I_PARTICIPATION_REPOSITORY,
    );
  });

  afterEach(async () => {
    await app.cleanup();
  });

  describe("Scenario: happy path", () => {
    it("should delete the participation", async () => {
      const result = await request(app.getHttpServer())
        .delete(`/draw/${drawId}/participation/${participantId}`)
        .set("Authorization", e2eUsers.alice.creaetAuthorizationToken());
      expect(result.status).toBe(200);

      const participation = await participationRepository.findOne(
        drawId,
        participantId,
      );
      expect(participation).toBeNull();
    });
  });

  describe("Scenario: the user is not authenticated", () => {
    it("should reject", async () => {
      const result = await request(app.getHttpServer()).delete(
        `/draw/${drawId}/participation/${participantId}`,
      );
      expect(result.status).toBe(403);

      const participation = await participationRepository.findOne(
        drawId,
        participantId,
      );
      expect(participation).toEqual(e2eParticipations.aliceSecretSanta.entity);
    });
  });
});
