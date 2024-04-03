import { FixedDateGenerator } from "../../core/adapters/fixed-date-generator";
import { FixedShuffleService } from "../../core/adapters/fixed-shuffle-service";
import { InMemoryMailer } from "../../core/adapters/in-memory-mailer";
import { InMemoryUserRepository } from "../../users/adapters/in-memory-user-repository";
import { testUsers } from "../../users/tests/user-seeds";
import { InMemoryChainedDrawRepository } from "../adapters/in-memory-chained-draw-repository";
import { InMemoryConditionRepository } from "../adapters/in-memory-condition-repository";
import { InMemoryDrawRepository } from "../adapters/in-memory-draw-repository";
import { InMemoryParticipationRepository } from "../adapters/in-memory-participation-repository";
import { testChainedDraws } from "../tests/chained-draw-seeds";
import { testConditions } from "../tests/condition-seeds";
import { testDraws } from "../tests/draw-seeds";
import { testParticipations } from "../tests/participation-seeds";
import { RunDrawCommandHandler } from "./run-draw";

describe("Feature: Running the Draw", () => {
  function expectNotCreatedChainedDraws() {
    const chainedDraws = chainedDrawRepository.findByDrawIdSync(drawId);
    expect(chainedDraws).toHaveLength(0);
  }

  const drawId = testDraws.secretSanta.props.id;

  let userRepository: InMemoryUserRepository;
  let drawRepository: InMemoryDrawRepository;
  let participationRepository: InMemoryParticipationRepository;
  let conditionRepository: InMemoryConditionRepository;
  let chainedDrawRepository: InMemoryChainedDrawRepository;
  let shuffleService: FixedShuffleService;
  let dateGenerator: FixedDateGenerator;
  let mailer: InMemoryMailer;
  let useCase: RunDrawCommandHandler;

  beforeEach(() => {
    userRepository = new InMemoryUserRepository([
      testUsers.alice,
      testUsers.bob,
      testUsers.charles,
      testUsers.david,
    ]);
    drawRepository = new InMemoryDrawRepository([testDraws.secretSanta]);
    participationRepository = new InMemoryParticipationRepository([
      testParticipations.aliceInSecretSanta,
      testParticipations.bobInSecretSanta,
      testParticipations.charlesInSecretSanta,
      testParticipations.davidInSecretSanta,
    ]);
    conditionRepository = new InMemoryConditionRepository([
      testConditions.aliceEqualCharlesInSecretSanta,
    ]);
    chainedDrawRepository = new InMemoryChainedDrawRepository();
    shuffleService = new FixedShuffleService();
    dateGenerator = new FixedDateGenerator();
    mailer = new InMemoryMailer([]);
    useCase = new RunDrawCommandHandler(
      userRepository,
      drawRepository,
      participationRepository,
      conditionRepository,
      chainedDrawRepository,
      shuffleService,
      dateGenerator,
      mailer,
    );
  });

  describe("Scenario: happy path", () => {
    const payload = {
      user: testUsers.alice,
      drawId,
    };

    it("should run the draw", async () => {
      await useCase.execute(payload);

      const chainedDraws = chainedDrawRepository.findByDrawIdSync(drawId);
      expect(chainedDraws).toHaveLength(4);
      expect(chainedDraws).toEqual([
        testChainedDraws.aliceToBobSecretSanta,
        testChainedDraws.bobToCharlesSecretSanta,
        testChainedDraws.charlesToDavidSecretSanta,
        testChainedDraws.davidToAliceSecretSanta,
      ]);
    });

    it("should send an email to each participant", async () => {
      await useCase.execute(payload);

      const emails = mailer.sentEmails;
      expect(emails).toHaveLength(5);
      expect(emails).toEqual([
        {
          to: testUsers.alice.props.emailAddress,
          subject: "Secret Santa Draw",
          body: `You are the Secret Santa of ${testUsers.bob.props.name}`,
        },
        {
          to: testUsers.bob.props.emailAddress,
          subject: "Secret Santa Draw",
          body: `You are the Secret Santa of ${testUsers.charles.props.name}`,
        },
        {
          to: testUsers.charles.props.emailAddress,
          subject: "Secret Santa Draw",
          body: `You are the Secret Santa of ${testUsers.david.props.name}`,
        },
        {
          to: testUsers.david.props.emailAddress,
          subject: "Secret Santa Draw",
          body: `You are the Secret Santa of ${testUsers.alice.props.name}`,
        },
        {
          to: testUsers.alice.props.emailAddress,
          subject: "Secret Santa Draw",
          body: "The Secret Santa draw has been completed",
        },
      ]);
    });
  });

  describe("Scenario: draw does not exist", () => {
    const payload = {
      user: testUsers.alice,
      drawId: "non-existing-draw-id",
    };

    it("should throw an error", async () => {
      await expect(useCase.execute(payload)).rejects.toThrowError(
        "Draw not found",
      );

      expectNotCreatedChainedDraws();
    });
  });

  describe("Scenario: the draw has less than 3 participants", () => {
    const payload = {
      user: testUsers.alice,
      drawId,
    };

    beforeEach(async () => {
      await participationRepository.delete(drawId, testUsers.charles.props.id);
      await participationRepository.delete(drawId, testUsers.david.props.id);
    });

    it("should throw an error", async () => {
      await expect(useCase.execute(payload)).rejects.toThrowError(
        "Draw must have at least 3 participants",
      );

      expectNotCreatedChainedDraws();
    });
  });

  describe("Scenario: Only the organizer can run draw", () => {
    const payload = {
      user: testUsers.bob,
      drawId,
    };

    it("should throw an error", async () => {
      await expect(useCase.execute(payload)).rejects.toThrowError(
        "Only the organizer can run the draw",
      );

      expectNotCreatedChainedDraws();
    });
  });

  describe("Scenario: Participant does not exist", () => {
    const payload = {
      user: testUsers.alice,
      drawId,
    };

    beforeEach(async () => {
      await userRepository.delete(testUsers.david);
    });

    it("should throw an error", async () => {
      await expect(useCase.execute(payload)).rejects.toThrowError(
        "Participant does not exist",
      );

      expectNotCreatedChainedDraws();
    });
  });

  describe("Scenario: Run draw with actual conditions with error", () => {
    const payload = {
      user: testUsers.alice,
      drawId,
    };

    beforeEach(async () => {
      await conditionRepository.create(
        testConditions.aliceEqualBobInSecretSanta,
      );
    });

    it("should throw an error", async () => {
      await expect(useCase.execute(payload)).rejects.toThrowError(
        "Run draw with actual conditions is impossible",
      );

      expectNotCreatedChainedDraws();
    });
  });
});
