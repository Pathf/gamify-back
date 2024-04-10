import { InMemoryUserRepository } from "../../users/adapters/in-memory/in-memory-user-repository";
import { testUsers } from "../../users/tests/user-seeds";
import { InMemoryChainedDrawRepository } from "../adapters/in-memory/in-memory-chained-draw-repository";
import { InMemoryDrawRepository } from "../adapters/in-memory/in-memory-draw-repository";
import { Draw } from "../entities/draw.entity";
import { testChainedDraws } from "../tests/chained-draw-seeds";
import { testDraws } from "../tests/draw-seeds";
import { GetDrawByIdQueryHandler } from "./get-draw-by-id";

describe("Feature: Get Draw By Id", () => {
  const drawId = testDraws.secretSanta.props.id;
  const payload = {
    drawId,
  };

  let drawRepository: InMemoryDrawRepository;
  let chainedDrawRepository: InMemoryChainedDrawRepository;
  let userRepository: InMemoryUserRepository;
  let useCase: GetDrawByIdQueryHandler;

  beforeEach(() => {
    drawRepository = new InMemoryDrawRepository([testDraws.secretSanta]);
    chainedDrawRepository = new InMemoryChainedDrawRepository([
      testChainedDraws.aliceToBobSecretSanta,
      testChainedDraws.bobToCharlesSecretSanta,
      testChainedDraws.charlesToDavidSecretSanta,
      testChainedDraws.davidToAliceSecretSanta,
    ]);
    userRepository = new InMemoryUserRepository([
      testUsers.alice,
      testUsers.bob,
      testUsers.charles,
      testUsers.david,
    ]);
    useCase = new GetDrawByIdQueryHandler(
      drawRepository,
      chainedDrawRepository,
      userRepository,
    );
  });

  describe("Scenario: Happy path", () => {
    it("should return a DrawResultDTO", async () => {
      const resultDTO = await useCase.execute(payload);

      expect(resultDTO).toEqual({
        id: drawId,
        title: testDraws.secretSanta.props.title,
        year: testDraws.secretSanta.props.year,
        runDrawDate:
          testChainedDraws.aliceToBobSecretSanta.props.dateDraw.toISOString(),
        organizer: {
          id: testUsers.alice.props.id,
          email: testUsers.alice.props.emailAddress,
          username: testUsers.alice.props.name,
        },
        chainedDraws: [
          {
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
            donor: {
              id: testUsers.bob.props.id,
              name: testUsers.bob.props.name,
            },
            receiver: {
              id: testUsers.charles.props.id,
              name: testUsers.charles.props.name,
            },
          },
          {
            donor: {
              id: testUsers.charles.props.id,
              name: testUsers.charles.props.name,
            },
            receiver: {
              id: testUsers.david.props.id,
              name: testUsers.david.props.name,
            },
          },
          {
            donor: {
              id: testUsers.david.props.id,
              name: testUsers.david.props.name,
            },
            receiver: {
              id: testUsers.alice.props.id,
              name: testUsers.alice.props.name,
            },
          },
        ],
      });
    });
  });

  describe("Scenario: Draw does not exist", () => {
    const payload2 = {
      drawId: "non-existing-id",
    };

    it("should throw an error", async () => {
      await expect(useCase.execute(payload2)).rejects.toThrowError(
        "Draw not found",
      );
    });
  });

  describe("Scenario: Organizer does not exist", () => {
    beforeEach(async () => {
      await userRepository.delete(testUsers.alice);
    });

    it("should throw an error", async () => {
      await expect(useCase.execute(payload)).rejects.toThrowError(
        "Organizer does not exist",
      );
    });
  });

  describe("Scenario: Draw does not run", () => {
    beforeEach(async () => {
      await chainedDrawRepository.deleteAll();
    });

    it("should throw an error", async () => {
      await expect(useCase.execute(payload)).rejects.toThrowError(
        "The draw does not run",
      );
    });
  });

  describe("Scenario: Donor does not exist", () => {
    beforeEach(async () => {
      drawRepository.setDraws([
        new Draw({
          ...testDraws.secretSanta.props,
          organizerId: testUsers.bob.props.id,
        }),
      ]);
      await userRepository.delete(testUsers.alice);
    });

    it("should throw an error", async () => {
      await expect(useCase.execute(payload)).rejects.toThrowError(
        "Donor does not exist",
      );
    });
  });

  describe("Scenario: Receiver does not exist", () => {
    beforeEach(async () => {
      await userRepository.delete(testUsers.bob);
    });

    it("should throw an error", async () => {
      await expect(useCase.execute(payload)).rejects.toThrowError(
        "Receiver does not exist",
      );
    });
  });
});
