import { InMemoryUserRepository } from "../../users/adapters/in-memory/in-memory-user-repository";
import { testUsers } from "../../users/tests/user-seeds";
import { InMemoryChainedDrawRepository } from "../adapters/in-memory/in-memory-chained-draw-repository";
import { InMemoryDrawRepository } from "../adapters/in-memory/in-memory-draw-repository";
import { testChainedDraws } from "../tests/chained-draw-seeds";
import { testDraws } from "../tests/draw-seeds";
import { GetDrawsQueryHandler } from "./get-draws";

describe("Feature: Get Draws", () => {
  let drawRepository: InMemoryDrawRepository;
  let chainedDrawRepository: InMemoryChainedDrawRepository;
  let userRepository: InMemoryUserRepository;
  let useCase: GetDrawsQueryHandler;

  beforeEach(() => {
    drawRepository = new InMemoryDrawRepository([
      testDraws.secretSanta,
      testDraws.tombola,
    ]);
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
    useCase = new GetDrawsQueryHandler(
      drawRepository,
      chainedDrawRepository,
      userRepository,
    );
  });

  describe("Scenario: Happy path", () => {
    it("should return a DrawsDTO", async () => {
      const resultDTO = await useCase.execute({});

      expect(resultDTO).toEqual(
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
          },
          {
            id: testDraws.tombola.props.id,
            title: testDraws.tombola.props.title,
            year: testDraws.tombola.props.year,
            runDrawDate: null,
            organizer: {
              id: testUsers.bob.props.id,
              email: testUsers.bob.props.emailAddress,
              username: testUsers.bob.props.name,
            },
          },
        ]),
      );
    });
  });

  describe("Scenario: Organizer does not exist", () => {
    beforeEach(async () => {
      await userRepository.delete(testUsers.alice);
    });

    it("should throw an error", async () => {
      await expect(useCase.execute({})).rejects.toThrowError(
        "Organizer does not exist",
      );
    });
  });
});
