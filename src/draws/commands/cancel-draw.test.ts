import { InMemoryMailer } from "../../core/adapters/in-memory/in-memory-mailer";
import { InMemoryUserRepository } from "../../users/adapters/in-memory/in-memory-user-repository";
import { testUsers } from "../../users/tests/user-seeds";
import { InMemoryConditionRepository } from "../adapters/in-memory/in-memory-condition-repository";
import { InMemoryDrawRepository } from "../adapters/in-memory/in-memory-draw-repository";
import { InMemoryParticipationRepository } from "../adapters/in-memory/in-memory-participation-repository";
import { testConditions } from "../tests/condition-seeds";
import { testDraws } from "../tests/draw-seeds";
import { testParticipations } from "../tests/participation-seeds";
import { CancelDrawCommandHandler } from "./cancel-draw";

describe("Feature: Canceling a draw", () => {
  function expectDrawToBeDeleted() {
    const draw = drawRepository.findByIdSync(drawId);
    expect(draw).toBeNull();
  }

  function expectDrawToBeNotDeleted() {
    const draw = drawRepository.findByIdSync(drawId);
    expect(draw).toBeDefined();
  }

  function expectParticipationToBeDeleted() {
    const participations =
      participationRepository.findAllParticipationByDrawIdSync(drawId);
    expect(participations).toHaveLength(0);
  }

  function expectParticipationToBeNotDeleted() {
    const participations =
      participationRepository.findAllParticipationByDrawIdSync(drawId);
    expect(participations).toHaveLength(1);
  }

  function expectConditionToBeDeleted() {
    const conditions = conditionRepository.findAllByDrawIdSync(drawId);
    expect(conditions).toHaveLength(0);
  }

  function expectConditionToBeNotDeleted() {
    const conditions = conditionRepository.findAllByDrawIdSync(drawId);
    expect(conditions).toHaveLength(1);
  }

  const drawId = testDraws.secretSanta.props.id;

  let useCase: CancelDrawCommandHandler;
  let drawRepository: InMemoryDrawRepository;
  let userRepository: InMemoryUserRepository;
  let participationRepository: InMemoryParticipationRepository;
  let conditionRepository: InMemoryConditionRepository;
  let mailer: InMemoryMailer;

  beforeEach(async () => {
    drawRepository = new InMemoryDrawRepository([testDraws.secretSanta]);
    userRepository = new InMemoryUserRepository([
      testUsers.alice,
      testUsers.bob,
    ]);
    participationRepository = new InMemoryParticipationRepository([
      testParticipations.aliceInSecretSanta,
    ]);
    conditionRepository = new InMemoryConditionRepository([
      testConditions.aliceToBobInSecretSanta,
    ]);
    mailer = new InMemoryMailer([]);

    useCase = new CancelDrawCommandHandler(
      drawRepository,
      userRepository,
      participationRepository,
      conditionRepository,
      mailer,
    );
  });

  describe("Scenario: happy path", () => {
    const payload = {
      drawId: drawId,
      user: testUsers.alice,
    };

    it("should cancel draw", async () => {
      await useCase.execute(payload);

      expectDrawToBeDeleted();
      expectParticipationToBeDeleted();
      expectConditionToBeDeleted();
    });

    it("should sent emails at participants", async () => {
      await useCase.execute(payload);

      expect(mailer.sentEmails).toHaveLength(1);
      expect(mailer.sentEmails[0]).toEqual({
        to: testUsers.alice.props.emailAddress,
        subject: "Draw canceled",
        body: `The draw ${testDraws.secretSanta.props.title} has been canceled`,
      });
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

      expectDrawToBeNotDeleted();
      expectParticipationToBeNotDeleted();
      expectConditionToBeNotDeleted();
      expect(mailer.sentEmails).toHaveLength(0);
    });
  });

  describe("Scenario: user does not organizer", () => {
    const payload = {
      drawId: drawId,
      user: testUsers.bob,
    };

    it("should fail", async () => {
      expect(async () => await useCase.execute(payload)).rejects.toThrowError(
        "You are not allowed to update this draw",
      );

      expectDrawToBeNotDeleted();
      expectParticipationToBeNotDeleted();
      expectConditionToBeNotDeleted();
      expect(mailer.sentEmails).toHaveLength(0);
    });
  });
});
