import { InMemoryUserRepository } from "../../users/adapters/in-memory/in-memory-user-repository";
import { testUsers } from "../../users/tests/user-seeds";
import { InMemoryConditionRepository } from "../adapters/in-memory/in-memory-condition-repository";
import { InMemoryDrawRepository } from "../adapters/in-memory/in-memory-draw-repository";
import { testConditions } from "../tests/condition-seeds";
import { testDraws } from "../tests/draw-seeds";
import { CancelConditionCommandHandler } from "./cancel-condition";

describe("Feature: Canceling a condition", () => {
  let userRepository: InMemoryUserRepository;
  let conditionRepository: InMemoryConditionRepository;
  let drawRepository: InMemoryDrawRepository;
  let useCase: CancelConditionCommandHandler;

  beforeEach(() => {
    userRepository = new InMemoryUserRepository([
      testUsers.alice,
      testUsers.bob,
    ]);
    conditionRepository = new InMemoryConditionRepository([
      testConditions.aliceToBobInSecretSanta,
      testConditions.aliceToBobInTombola,
    ]);
    drawRepository = new InMemoryDrawRepository([testDraws.secretSanta]);
    useCase = new CancelConditionCommandHandler(
      conditionRepository,
      userRepository,
      drawRepository,
    );
  });

  describe("Scenario: happy path", () => {
    const payload = {
      user: testUsers.alice,
      drawId: testDraws.secretSanta.props.id,
      conditionId: testConditions.aliceToBobInSecretSanta.props.id,
    };

    it("should delete condition", async () => {
      await useCase.execute(payload);

      const condition = conditionRepository.findByIdSync(
        testConditions.aliceToBobInSecretSanta.props.id,
      );
      expect(condition).toBeNull();
    });
  });

  describe("Scenario: Condition does not exist", () => {
    const payload = {
      user: testUsers.alice,
      drawId: testDraws.secretSanta.props.id,
      conditionId: "non-existing-condition-id",
    };

    it("should fail", async () => {
      await expect(useCase.execute(payload)).rejects.toThrowError(
        "Condition does not exist",
      );

      const condition = conditionRepository.findByIdSync(
        testConditions.aliceToBobInSecretSanta.props.id,
      );
      expect(condition).toEqual(testConditions.aliceToBobInSecretSanta);
    });
  });

  describe("Scenario: organizer does not exist", () => {
    const payload = {
      user: testUsers.charles,
      drawId: testDraws.secretSanta.props.id,
      conditionId: testConditions.aliceToBobInSecretSanta.props.id,
    };

    it("should fail", async () => {
      await expect(useCase.execute(payload)).rejects.toThrowError(
        "Organizer does not exist",
      );

      const condition = conditionRepository.findByIdSync(
        testConditions.aliceToBobInSecretSanta.props.id,
      );
      expect(condition).toEqual(testConditions.aliceToBobInSecretSanta);
    });
  });

  describe("Scenario: draw not found", () => {
    const payload = {
      user: testUsers.bob,
      drawId: "non-existing-draw-id",
      conditionId: testConditions.aliceToBobInTombola.props.id,
    };

    it("should fail", async () => {
      await expect(useCase.execute(payload)).rejects.toThrowError(
        "Draw not found",
      );

      const condition = conditionRepository.findByIdSync(
        testConditions.aliceToBobInSecretSanta.props.id,
      );
      expect(condition).toEqual(testConditions.aliceToBobInSecretSanta);
    });
  });

  describe("Scenario: user does not organizer", () => {
    const payload = {
      user: testUsers.bob,
      drawId: testDraws.secretSanta.props.id,
      conditionId: testConditions.aliceToBobInSecretSanta.props.id,
    };

    it("should fail", async () => {
      await expect(useCase.execute(payload)).rejects.toThrowError(
        "Only organizer can cancel condition",
      );

      const condition = conditionRepository.findByIdSync(
        testConditions.aliceToBobInSecretSanta.props.id,
      );
      expect(condition).toEqual(testConditions.aliceToBobInSecretSanta);
    });
  });
});
