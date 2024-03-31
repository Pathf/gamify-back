import * as request from "supertest";
import {
  IDrawRepository,
  I_DRAW_REPOSITORY,
} from "../draws/ports/draw-repository.interace";
import { e2eDraws } from "./seeds/draw-seeds.e2e";
import { e2eUserRoles } from "./seeds/user-roles-seeds.e2e";
import { e2eUsers } from "./seeds/user-seeds.e2e";
import { TestApp } from "./utils/test-app";

describe("Feature: Organizing a draw", () => {
  let app: TestApp;
  let drawRepository: IDrawRepository;

  beforeEach(async () => {
    app = new TestApp();
    await app.setup();
    await app.loadFixture([e2eUsers.alice, e2eUserRoles.aliceRoles]);
    drawRepository = app.get<IDrawRepository>(I_DRAW_REPOSITORY);
  });

  afterEach(async () => {
    await app.cleanup();
  });

  describe("Scenario: happy path", () => {
    it("should create a draw", async () => {
      const result = await request(app.getHttpServer())
        .post("/draws")
        .set("Authorization", e2eUsers.alice.creaetAuthorizationToken())
        .send({
          title: e2eDraws.secretSanta.entity.props.title,
          year: e2eDraws.secretSanta.entity.props.year,
        });
      expect(result.status).toBe(201);

      const draws = await drawRepository.findAll();
      expect(draws).toHaveLength(1);
      expect(draws[0].props).toEqual({
        id: expect.any(String),
        title: e2eDraws.secretSanta.entity.props.title,
        year: e2eDraws.secretSanta.entity.props.year,
        organizerId: e2eUsers.alice.entity.props.id,
      });
    });
  });

  describe("Scenario: user is not authenticated", () => {
    it("should reject", async () => {
      const result = await request(app.getHttpServer()).post("/draws").send({
        title: "Secret Santa",
        year: 2021,
      });
      expect(result.status).toBe(403);

      const draws = await drawRepository.findAll();
      expect(draws).toEqual([]);
    });
  });
});
