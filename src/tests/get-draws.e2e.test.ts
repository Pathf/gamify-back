import * as request from "supertest";
import { e2eChainedDraws } from "./seeds/chained-draw-seeds.e2e";
import { e2eDraws } from "./seeds/draw-seeds.e2e";
import { e2eUsers } from "./seeds/user-seeds.e2e";
import { TestApp } from "./utils/test-app";

describe("Feature: Getting draws", () => {
  let app: TestApp;

  beforeEach(async () => {
    app = new TestApp();
    await app.setup();
    await app.loadFixture([
      e2eUsers.alice,
      e2eUsers.bob,
      e2eUsers.charles,
      e2eUsers.david,
      e2eDraws.secretSanta,
      e2eDraws.tombola,
      e2eChainedDraws.aliceToBobSecretSanta,
      e2eChainedDraws.bobToCharlesSecretSanta,
      e2eChainedDraws.charlesToDavidSecretSanta,
      e2eChainedDraws.davidToAliceSecretSanta,
    ]);
  });

  afterEach(async () => {
    await app.cleanup();
  });

  describe("Scenario: happy path", () => {
    it("should succeed", async () => {
      const result = await request(app.getHttpServer())
        .get("/draws")
        .set("Authorization", e2eUsers.alice.createAuthorizationToken());

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
              email: e2eUsers.alice.entity.props.emailAddress,
              username: e2eUsers.alice.entity.props.name,
            },
          },
          {
            id: e2eDraws.tombola.entity.props.id,
            title: e2eDraws.tombola.entity.props.title,
            year: e2eDraws.tombola.entity.props.year,
            runDrawDate: null,
            organizer: {
              id: e2eUsers.bob.entity.props.id,
              email: e2eUsers.bob.entity.props.emailAddress,
              username: e2eUsers.bob.entity.props.name,
            },
          },
        ]),
      );
    });
  });

  describe("Scenario: the user is not authenticated", () => {
    it("should reject", async () => {
      const result = await request(app.getHttpServer()).get("/draws");

      expect(result.status).toBe(401);
    });
  });
});
