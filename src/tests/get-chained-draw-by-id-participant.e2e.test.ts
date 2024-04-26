import * as request from "supertest";
import { e2eChainedDraws } from "./seeds/chained-draw-seeds.e2e";
import { e2eDraws } from "./seeds/draw-seeds.e2e";
import { e2eUsers } from "./seeds/user-seeds.e2e";
import { TestApp } from "./utils/test-app";

describe("Feature: Getting a draw by participant id", () => {
  const participantId = e2eUsers.alice.entity.props.id;

  let app: TestApp;

  beforeEach(async () => {
    app = new TestApp();
    await app.setup();
    await app.loadFixture([
      e2eUsers.alice,
      e2eUsers.bob,
      e2eDraws.secretSanta,
      e2eChainedDraws.aliceToBobSecretSanta,
    ]);
  });

  afterEach(async () => {
    await app.cleanup();
  });

  describe("Scenario: happy path", () => {
    it("should succeed", async () => {
      const result = await request(app.getHttpServer())
        .get(`/draws/participant/${participantId}/result`)
        .set("Authorization", e2eUsers.alice.creaetAuthorizationToken());

      expect(result.status).toBe(200);
      expect(result.body).toEqual(
        expect.arrayContaining([
          {
            id: e2eDraws.secretSanta.entity.props.id,
            title: e2eDraws.secretSanta.entity.props.title,
            year: e2eDraws.secretSanta.entity.props.year,
            runDrawDate:
              e2eChainedDraws.aliceToBobSecretSanta.entity.props.dateDraw.toISOString(),
            organizer: {
              id: e2eUsers.alice.entity.props.id,
              username: e2eUsers.alice.entity.props.name,
              email: e2eUsers.alice.entity.props.emailAddress,
            },
            donor: {
              id: e2eUsers.alice.entity.props.id,
              name: e2eUsers.alice.entity.props.name,
            },
            receiver: {
              id: e2eUsers.bob.entity.props.id,
              name: e2eUsers.bob.entity.props.name,
            },
          },
        ]),
      );
    });
  });

  describe("Scenario: the user is not authenticated", () => {
    it("should reject", async () => {
      const result = await request(app.getHttpServer()).get(
        `/draws/participant/${participantId}/result`,
      );

      expect(result.status).toBe(401);
    });
  });
});
