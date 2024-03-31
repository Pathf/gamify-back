import { InMemoryUserRepository } from "../../users/adapters/in-memory-user-repository";
import { testUsers } from "../../users/tests/user-seeds";
import { InMemoryDrawRepository } from "../adapters/in-memory-draw-repository";
import { InMemoryParticipationRepository } from "../adapters/in-memory-participation-repository";
import { testDraws } from "../tests/draw-seeds";
import { testParticipations } from "../tests/participation-seeds";
import { CancelParticipationCommandHandler } from "./cancel-participation";

describe("Feature: Canceling participation", () => {
  function expectToDeleteParticipation() {
    const participations =
      participationRepository.findAllParticipationByDrawIdSync(
        testDraws.secretSanta.props.id,
      );
    expect(participations).toHaveLength(0);
  }

  function expectToDoesNotDeletedParticipation() {
    const participations =
      participationRepository.findAllParticipationByDrawIdSync(
        testDraws.secretSanta.props.id,
      );
    expect(participations).toHaveLength(1);
  }

  let drawRepository: InMemoryDrawRepository;
  let participationRepository: InMemoryParticipationRepository;
  let userRepository: InMemoryUserRepository;
  let useCase: CancelParticipationCommandHandler;

  beforeEach(async () => {
    drawRepository = new InMemoryDrawRepository([testDraws.secretSanta]);
    participationRepository = new InMemoryParticipationRepository([
      testParticipations.aliceInSecretSanta,
    ]);
    userRepository = new InMemoryUserRepository([
      testUsers.alice,
      testUsers.bob,
    ]);
    useCase = new CancelParticipationCommandHandler(
      drawRepository,
      participationRepository,
      userRepository,
    );
  });

  describe("Scenario: Happy path", () => {
    const payload = {
      organizerId: testUsers.alice.props.id,
      drawId: testDraws.secretSanta.props.id,
      participantId: testUsers.alice.props.id,
    };

    it("should delete a participation of the draw", async () => {
      await useCase.execute(payload);
      expectToDeleteParticipation();
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
      expectToDoesNotDeletedParticipation();
    });
  });

  describe("Scenario: Participant does not exist", () => {
    const payload = {
      organizerId: testUsers.alice.props.id,
      drawId: testDraws.secretSanta.props.id,
      participantId: "non-existing-user-id",
    };

    it("should fail", async () => {
      await expect(useCase.execute(payload)).rejects.toThrowError(
        "Participant does not exist",
      );
      expectToDoesNotDeletedParticipation();
    });
  });

  describe("Scenario: Organizer does not exist", () => {
    const payload = {
      organizerId: "non-existing-user-id",
      drawId: testDraws.secretSanta.props.id,
      participantId: testUsers.alice.props.id,
    };

    it("should fail", async () => {
      await expect(useCase.execute(payload)).rejects.toThrowError(
        "Organizer does not exist",
      );
      expectToDoesNotDeletedParticipation();
    });
  });

  describe("Scenario: user does not organizer", () => {
    const payload = {
      organizerId: testUsers.bob.props.id,
      drawId: testDraws.secretSanta.props.id,
      participantId: testUsers.alice.props.id,
    };

    it("should fail", async () => {
      await expect(useCase.execute(payload)).rejects.toThrowError(
        "Only the organizer can cancel a participation",
      );
      expectToDoesNotDeletedParticipation();
    });
  });
});
