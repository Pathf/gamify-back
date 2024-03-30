import { InMemoryMailer } from "../../core/adapters/in-memory-mailer";
import { InMemoryUserRepository } from "../../users/adapters/in-memory-user-repository";
import { testUsers } from "../../users/tests/user-seeds";
import { InMemoryDrawRepository } from "../adapters/in-memory-draw-repository";
import { testDraws } from "../tests/draw-seeds";
import { CancelDrawCommandHandler } from "./cancel-draw";

describe("Feature: Canceling a draw", () => {
  let useCase: CancelDrawCommandHandler;
  let drawRepository: InMemoryDrawRepository;
  let userRepository: InMemoryUserRepository;
  let mailer: InMemoryMailer;

  beforeEach(async () => {
    drawRepository = new InMemoryDrawRepository([testDraws.secretSanta]);
    userRepository = new InMemoryUserRepository([
      testUsers.alice,
      testUsers.bob,
    ]);
    mailer = new InMemoryMailer([]);

    useCase = new CancelDrawCommandHandler(
      drawRepository,
      userRepository,
      mailer,
    );
  });

  describe("Scenario: happy path", () => {
    const payload = {
      drawId: testDraws.secretSanta.props.id,
      user: testUsers.alice,
    };

    it("should cancel draw", async () => {
      await useCase.execute(payload);

      const draw = await drawRepository.findById(
        testDraws.secretSanta.props.id,
      );
      expect(draw).toBeNull();
    });

    it("should sent emails at participants", async () => {
      // TODO : Implement this test
    });
  });

  describe("Scenario: draw does not exist", () => {
    const payload = {
      drawId: "unknown-draw-id",
      user: testUsers.alice,
    };

    it("should fail", async () => {
      expect(async () => await useCase.execute(payload)).rejects.toThrowError(
        "Draw not found",
      );

      const draw = await drawRepository.findById(
        testDraws.secretSanta.props.id,
      );
      expect(draw).toBeDefined();
      expect(mailer.sentEmails).toHaveLength(0);
    });
  });

  describe("Scenario: user does not organizer", () => {
    const payload = {
      drawId: testDraws.secretSanta.props.id,
      user: testUsers.bob,
    };

    it("should fail", async () => {
      expect(async () => await useCase.execute(payload)).rejects.toThrowError(
        "You are not allowed to update this draw",
      );

      const draw = await drawRepository.findById(
        testDraws.secretSanta.props.id,
      );
      expect(draw).toBeDefined();
      expect(mailer.sentEmails).toHaveLength(0);
    });
  });
});
