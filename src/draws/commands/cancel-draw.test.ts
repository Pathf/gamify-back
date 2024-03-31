import { InMemoryMailer } from "../../core/adapters/in-memory-mailer";
import { InMemoryUserRepository } from "../../users/adapters/in-memory-user-repository";
import { testUsers } from "../../users/tests/user-seeds";
import { InMemoryDrawRepository } from "../adapters/in-memory-draw-repository";
import { InMemoryParticipationRepository } from "../adapters/in-memory-participation-repository";
import { testDraws } from "../tests/draw-seeds";
import { testParticipants as testParticipations } from "../tests/participant-seeds";
import { CancelDrawCommandHandler } from "./cancel-draw";

describe("Feature: Canceling a draw", () => {
  async function expectDrawToBeDeleted() {
    const draw = await drawRepository.findById(testDraws.secretSanta.props.id);
    expect(draw).toBeNull();
  }

  async function expectDrawToBeNotDeleted() {
    const draw = await drawRepository.findById(testDraws.secretSanta.props.id);
    expect(draw).toBeDefined();
  }

  async function expectParticipationToBeDeleted() {
    const participations =
      await participationRepository.findAllParticipationByDrawId(
        testDraws.secretSanta.props.id,
      );
    expect(participations).toHaveLength(0);
  }

  async function expectParticipationToBeNotDeleted() {
    const participations =
      await participationRepository.findAllParticipationByDrawId(
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

      await expectDrawToBeDeleted();
      await expectParticipationToBeDeleted();
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

      await expectDrawToBeNotDeleted();
      await expectParticipationToBeNotDeleted();
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

      await expectDrawToBeNotDeleted();
      await expectParticipationToBeNotDeleted();
      expect(mailer.sentEmails).toHaveLength(0);
    });
  });
});
