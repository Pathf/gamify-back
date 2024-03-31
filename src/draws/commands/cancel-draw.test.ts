import { InMemoryMailer } from "../../core/adapters/in-memory-mailer";
import { InMemoryUserRepository } from "../../users/adapters/in-memory-user-repository";
import { testUsers } from "../../users/tests/user-seeds";
import { InMemoryDrawRepository } from "../adapters/in-memory-draw-repository";
import { InMemoryParticipationRepository } from "../adapters/in-memory-participation-repository";
import { testDraws } from "../tests/draw-seeds";
import { testParticipations } from "../tests/participation-seeds";
import { CancelDrawCommandHandler } from "./cancel-draw";

describe("Feature: Canceling a draw", () => {
  function expectDrawToBeDeleted() {
    const draw = drawRepository.findByIdSync(testDraws.secretSanta.props.id);
    expect(draw).toBeNull();
  }

  function expectDrawToBeNotDeleted() {
    const draw = drawRepository.findByIdSync(testDraws.secretSanta.props.id);
    expect(draw).toBeDefined();
  }

  function expectParticipationToBeDeleted() {
    const participations =
      participationRepository.findAllParticipationByDrawIdSync(
        testDraws.secretSanta.props.id,
      );
    expect(participations).toHaveLength(0);
  }

  function expectParticipationToBeNotDeleted() {
    const participations =
      participationRepository.findAllParticipationByDrawIdSync(
        testDraws.secretSanta.props.id,
      );
    expect(participations).toHaveLength(1);
  }

  let useCase: CancelDrawCommandHandler;
  let drawRepository: InMemoryDrawRepository;
  let userRepository: InMemoryUserRepository;
  let participationRepository: InMemoryParticipationRepository;
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
    mailer = new InMemoryMailer([]);

    useCase = new CancelDrawCommandHandler(
      drawRepository,
      userRepository,
      participationRepository,
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

      expectDrawToBeDeleted();
      expectParticipationToBeDeleted();
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

      expectDrawToBeNotDeleted();
      expectParticipationToBeNotDeleted();
      expect(mailer.sentEmails).toHaveLength(0);
    });
  });
});
