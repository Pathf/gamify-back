import { InMemoryUserRepository } from "../../users/adapters/in-memory/in-memory-user-repository";
import { testUsers } from "../../users/tests/user-seeds";
import { InMemoryChainedDrawRepository } from "../adapters/in-memory/in-memory-chained-draw-repository";
import { InMemoryDrawRepository } from "../adapters/in-memory/in-memory-draw-repository";
import { testChainedDraws } from "../tests/chained-draw-seeds";
import { testDraws } from "../tests/draw-seeds";
import { GetChainedDrawsByIdParticipantQueryHandler } from "./get-chained-draw-by-id-participant";

describe("Feature: Get chained draw by id participant", () => {
  let userRepository: InMemoryUserRepository;
  let drawRepository: InMemoryDrawRepository;
  let chainedDrawRepository: InMemoryChainedDrawRepository;
  let useCase: GetChainedDrawsByIdParticipantQueryHandler;

  beforeEach(() => {
    userRepository = new InMemoryUserRepository([
      testUsers.alice,
      testUsers.bob,
      testUsers.charles,
      testUsers.david,
    ]);
    drawRepository = new InMemoryDrawRepository([
      testDraws.secretSanta,
      testDraws.drawIsAlreadyOver,
    ]);
    chainedDrawRepository = new InMemoryChainedDrawRepository([
      testChainedDraws.aliceToBobSecretSanta,
      testChainedDraws.aliceToCharlesDrawIsAlreadyOver,
    ]);
    useCase = new GetChainedDrawsByIdParticipantQueryHandler(
      userRepository,
      drawRepository,
      chainedDrawRepository,
    );
  });

  describe("Scenario: Happy path", () => {
    const payload = {
      participantId: testUsers.alice.props.id,
    };

    it("should get draws by id participant", async () => {
      const result = await useCase.execute(payload);

      expect(result).toEqual(
        expect.arrayContaining([
          {
            id: testDraws.secretSanta.props.id,
            title: testDraws.secretSanta.props.title,
            year: testDraws.secretSanta.props.year,
            runDrawDate:
              testChainedDraws.aliceToBobSecretSanta.props.dateDraw.toISOString(),
            organizer: {
              id: testUsers.alice.props.id,
              email: testUsers.alice.props.emailAddress,
              username: testUsers.alice.props.name,
            },
            donor: {
              id: testUsers.alice.props.id,
              name: testUsers.alice.props.name,
            },
            receiver: {
              id: testUsers.bob.props.id,
              name: testUsers.bob.props.name,
            },
          },
          {
            id: testDraws.drawIsAlreadyOver.props.id,
            title: testDraws.drawIsAlreadyOver.props.title,
            year: testDraws.drawIsAlreadyOver.props.year,
            runDrawDate:
              testChainedDraws.aliceToCharlesDrawIsAlreadyOver.props.dateDraw.toISOString(),
            organizer: {
              id: testUsers.charles.props.id,
              email: testUsers.charles.props.emailAddress,
              username: testUsers.charles.props.name,
            },
            donor: {
              id: testUsers.alice.props.id,
              name: testUsers.alice.props.name,
            },
            receiver: {
              id: testUsers.charles.props.id,
              name: testUsers.charles.props.name,
            },
          },
        ]),
      );
    });
  });

  describe("Scenario: A draw does not exist", () => {
    const payload = {
      participantId: testUsers.alice.props.id,
    };

    beforeEach(() => {
      drawRepository = new InMemoryDrawRepository([]);
      useCase = new GetChainedDrawsByIdParticipantQueryHandler(
        userRepository,
        drawRepository,
        chainedDrawRepository,
      );
    });

    it("should return an error", async () => {
      await expect(useCase.execute(payload)).rejects.toThrowError(
        "Draw not found",
      );
    });
  });

  describe("Scenario: Organizer does not exist", () => {
    const payload = {
      participantId: testUsers.bob.props.id,
    };

    beforeEach(() => {
      userRepository = new InMemoryUserRepository([testUsers.bob]);
      chainedDrawRepository = new InMemoryChainedDrawRepository([
        testChainedDraws.bobToCharlesSecretSanta,
      ]);
      useCase = new GetChainedDrawsByIdParticipantQueryHandler(
        userRepository,
        drawRepository,
        chainedDrawRepository,
      );
    });

    it("should return an error", async () => {
      await expect(useCase.execute(payload)).rejects.toThrowError(
        "Organizer does not exist",
      );
    });
  });

  describe("Scenario: Donor does not exist", () => {
    const payload = {
      participantId: testUsers.bob.props.id,
    };

    beforeEach(() => {
      userRepository = new InMemoryUserRepository([
        testUsers.alice,
        testUsers.charles,
      ]);
      chainedDrawRepository = new InMemoryChainedDrawRepository([
        testChainedDraws.bobToCharlesSecretSanta,
      ]);
      useCase = new GetChainedDrawsByIdParticipantQueryHandler(
        userRepository,
        drawRepository,
        chainedDrawRepository,
      );
    });

    it("should return an error", async () => {
      await expect(useCase.execute(payload)).rejects.toThrowError(
        "Donor does not exist",
      );
    });
  });

  describe("Scenario: Receiver does not exist", () => {
    const payload = {
      participantId: testUsers.alice.props.id,
    };

    beforeEach(() => {
      userRepository = new InMemoryUserRepository([
        testUsers.alice,
        testUsers.charles,
      ]);
      useCase = new GetChainedDrawsByIdParticipantQueryHandler(
        userRepository,
        drawRepository,
        chainedDrawRepository,
      );
    });

    it("should return an error", async () => {
      await expect(useCase.execute(payload)).rejects.toThrowError(
        "Receiver does not exist",
      );
    });
  });
});
