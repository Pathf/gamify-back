import { InMemoryUserRepository } from "../../users/adapters/in-memory-user-repository";
import { testUsers } from "../../users/tests/user-seeds";
import { InMemoryDrawRepository } from "../adapters/in-memory-draw-repository";
import { InMemoryParticipationRepository } from "../adapters/in-memory-participation-repository";
import { testDraws } from "../tests/draw-seeds";
import { testParticipants } from "../tests/participant-seeds";
import { RegisterParticipationCommandHandler } from "./register-participation";

describe("Feature: Registering participation", () => {
  function expectParticipationToBeNotRegistered() {
    const participations =
      participationRepository.findAllParticipationByDrawIdSync(
        testDraws.secretSanta.props.id,
      );
    expect(participations).toHaveLength(1);
    expect(participations[0].props).toEqual({
      drawId: testDraws.secretSanta.props.id,
      participantId: testUsers.alice.props.id,
    });
  }

  let drawRepository: InMemoryDrawRepository;
  let userRepository: InMemoryUserRepository;
  let participationRepository: InMemoryParticipationRepository;
  let useCase: RegisterParticipationCommandHandler;

  beforeEach(async () => {
    drawRepository = new InMemoryDrawRepository([testDraws.secretSanta]);
    userRepository = new InMemoryUserRepository([
      testUsers.alice,
      testUsers.bob,
    ]);
    participationRepository = new InMemoryParticipationRepository([
      testParticipants.aliceInSecretSanta,
    ]);
    useCase = new RegisterParticipationCommandHandler(
      drawRepository,
      userRepository,
      participationRepository,
    );
  });

  describe("Scenario: Happy path", () => {
    const payload = {
      organizerId: testUsers.alice.props.id,
      drawId: testDraws.secretSanta.props.id,
      participantId: testUsers.bob.props.id,
    };

    it("should register participation at the draw", async () => {
      await useCase.execute(payload);

      const participation = participationRepository.findOneSync(
        testDraws.secretSanta.props.id,
        testUsers.bob.props.id,
      );
      expect(participation).not.toBeNull();
      expect(participation?.props).toEqual({
        drawId: testDraws.secretSanta.props.id,
        participantId: testUsers.bob.props.id,
      });
    });
  });

  describe("Scenario: Participant is already registered", () => {
    const payload = {
      organizerId: testUsers.alice.props.id,
      drawId: testDraws.secretSanta.props.id,
      participantId: testUsers.alice.props.id,
    };

    it("should fail", async () => {
      await expect(useCase.execute(payload)).rejects.toThrowError(
        "Participant is already registered",
      );

      expectParticipationToBeNotRegistered();
    });
  });

  describe("Scenario: Draw does not exist", () => {
    const payload = {
      organizerId: testUsers.alice.props.id,
      drawId: "non-existing-draw-id",
      participantId: testUsers.alice.props.id,
    };

    it("should fail", async () => {
      await expect(useCase.execute(payload)).rejects.toThrowError(
        "Draw not found",
      );

      expectParticipationToBeNotRegistered();
    });
  });

  describe("Scenario: Participant does not exist", () => {
    const payload = {
      organizerId: testUsers.alice.props.id,
      drawId: testDraws.secretSanta.props.id,
      participantId: "non-existing-participant-id",
    };

    it("should fail", async () => {
      await expect(useCase.execute(payload)).rejects.toThrowError(
        "Participant does not exist",
      );

      expectParticipationToBeNotRegistered();
    });
  });

  describe("Scenario: user does not organizer", () => {
    const payload = {
      organizerId: testUsers.bob.props.id,
      drawId: testDraws.secretSanta.props.id,
      participantId: testUsers.bob.props.id,
    };

    it("should fail", async () => {
      await expect(useCase.execute(payload)).rejects.toThrowError(
        "Only the organizer can register participants",
      );

      expectParticipationToBeNotRegistered();
    });
  });
});
