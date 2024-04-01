import { InMemoryUserRepository } from "../../users/adapters/in-memory-user-repository";
import { testUsers } from "../../users/tests/user-seeds";
import { InMemoryConditionRepository } from "../adapters/in-memory-condition-repository";
import { InMemoryDrawRepository } from "../adapters/in-memory-draw-repository";
import { InMemoryParticipationRepository } from "../adapters/in-memory-participation-repository";
import { testConditions } from "../tests/condition-seeds";
import { testDraws } from "../tests/draw-seeds";
import { testParticipations } from "../tests/participation-seeds";
import { RegisterConditionCommandHandler } from "./register-condition";

describe("Feature: Registering Condition", () => {
  function expectToBeNotRegisteredCondition() {
    const condition = conditionRepository.findSync(
      testDraws.secretSanta.props.id,
      testUsers.alice.props.id,
      testUsers.bob.props.id,
    );
    expect(condition).toBeNull();
  }

  const payload = {
    user: testUsers.alice,
    drawId: testDraws.secretSanta.props.id,
    donorId: testUsers.alice.props.id,
    receiverId: testUsers.bob.props.id,
    isViceVersa: false,
  };

  let userRepository: InMemoryUserRepository;
  let drawRepository: InMemoryDrawRepository;
  let participationRepository: InMemoryParticipationRepository;
  let conditionRepository: InMemoryConditionRepository;
  let useCase: RegisterConditionCommandHandler;

  beforeEach(() => {
    userRepository = new InMemoryUserRepository([
      testUsers.alice,
      testUsers.bob,
      testUsers.charles,
    ]);
    drawRepository = new InMemoryDrawRepository([
      testDraws.secretSanta,
      testDraws.tombola,
    ]);
    participationRepository = new InMemoryParticipationRepository([
      testParticipations.aliceInSecretSanta,
      testParticipations.bobInSecretSanta,
      testParticipations.charlesInSecretSanta,
      testParticipations.aliceInTombola,
      testParticipations.bobInTombola,
    ]);
    conditionRepository = new InMemoryConditionRepository([]);
    useCase = new RegisterConditionCommandHandler(
      userRepository,
      drawRepository,
      participationRepository,
      conditionRepository,
    );
  });

  describe("Scenario: happy path", () => {
    it("should register a condition", async () => {
      await useCase.execute(payload);

      const condition = conditionRepository.findSync(
        testDraws.secretSanta.props.id,
        testUsers.alice.props.id,
        testUsers.bob.props.id,
      );
      expect(condition?.props).toEqual({
        drawId: testDraws.secretSanta.props.id,
        donorId: testUsers.alice.props.id,
        receiverId: testUsers.bob.props.id,
        isViceVersa: false,
      });
    });
  });

  describe("Scenario: Draw does not exist", () => {
    it("should fail", async () => {
      await expect(
        useCase.execute({ ...payload, drawId: "non-existing-draw-id" }),
      ).rejects.toThrowError("Draw not found");

      expectToBeNotRegisteredCondition();
    });
  });

  describe("Scenario: Organizer does not exist", () => {
    it("should fail", async () => {
      await expect(
        useCase.execute({ ...payload, user: testUsers.david }),
      ).rejects.toThrowError("Organizer does not exist");

      expectToBeNotRegisteredCondition();
    });
  });

  describe("Scenario: Only the organizer can register a condition", () => {
    it("should fail", async () => {
      await expect(
        useCase.execute({ ...payload, user: testUsers.bob }),
      ).rejects.toThrowError("Only the organizer can register a condition");

      expectToBeNotRegisteredCondition();
    });
  });

  describe("Scenario: Donor participant does not exist", () => {
    it("should fail", async () => {
      await expect(
        useCase.execute({
          ...payload,
          donorId: testUsers.david.props.id,
        }),
      ).rejects.toThrowError("Donor does not exist");

      expectToBeNotRegisteredCondition();
    });
  });

  describe("Scenario: Donor participation does not exist in the draw", () => {
    beforeEach(() => {
      userRepository.createUser(testUsers.david);
    });

    it("should fail", async () => {
      await expect(
        useCase.execute({
          ...payload,
          donorId: testUsers.david.props.id,
        }),
      ).rejects.toThrowError("Donor participation does not exist in the draw");

      expectToBeNotRegisteredCondition();
    });
  });

  describe("Scenario: Receiver does not exist", () => {
    it("should fail", async () => {
      await expect(
        useCase.execute({
          ...payload,
          receiverId: testUsers.david.props.id,
        }),
      ).rejects.toThrowError("Receiver does not exist");

      expectToBeNotRegisteredCondition();
    });
  });

  describe("Scenario: Reciever participation does not exist in the draw", () => {
    beforeEach(() => {
      userRepository.createUser(testUsers.david);
    });
    it("should fail", async () => {
      await expect(
        useCase.execute({
          ...payload,
          receiverId: testUsers.david.props.id,
        }),
      ).rejects.toThrowError(
        "Reciever participation does not exist in the draw",
      );

      expectToBeNotRegisteredCondition();
    });
  });

  describe("Scenario: condition already exist", () => {
    beforeEach(() => {
      conditionRepository.create(testConditions.aliceToBobInSecretSanta);
    });
    it("should fail", async () => {
      await expect(useCase.execute(payload)).rejects.toThrowError(
        "Condition already exist",
      );
    });
  });
});
