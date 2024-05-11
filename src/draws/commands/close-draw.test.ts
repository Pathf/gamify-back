import { testUsers } from "../../users/tests/user-seeds";
import { InMemoryChainedDrawRepository } from "../adapters/in-memory/in-memory-chained-draw-repository";
import { InMemoryDrawRepository } from "../adapters/in-memory/in-memory-draw-repository";
import { testChainedDraws } from "../tests/chained-draw-seeds";
import { testDraws } from "../tests/draw-seeds";
import { CloseDrawCommandHandler } from "./close-draw";

describe("Feature: closing draw", () => {
  let chainedDrawRepository: InMemoryChainedDrawRepository;
  let drawRepository: InMemoryDrawRepository;
  let useCase: CloseDrawCommandHandler;

  beforeEach(async () => {
    drawRepository = new InMemoryDrawRepository([
      Object.create(testDraws.secretSanta),
      Object.create(testDraws.tombola),
      Object.create(testDraws.drawIsAlreadyOver),
    ]);
    chainedDrawRepository = new InMemoryChainedDrawRepository([
      testChainedDraws.aliceToBobSecretSanta,
      testChainedDraws.bobToCharlesSecretSanta,
      testChainedDraws.aliceToCharlesDrawIsAlreadyOver,
    ]);
    useCase = new CloseDrawCommandHandler(
      drawRepository,
      chainedDrawRepository,
    );
  });

  describe("Scenario: Happy path", () => {
    const payload = {
      user: testUsers.alice,
      drawId: testDraws.secretSanta.props.id,
    };

    it("should be closed", async () => {
      await useCase.execute(payload);

      const draw = drawRepository.findByIdSync(testDraws.secretSanta.props.id);

      expect(draw).toBeDefined();
      expect(draw?.props).toEqual({
        ...testDraws.secretSanta.props,
        isFinish: true,
      });
    });
  });

  describe("Scenario: draw does not exist", () => {
    const payload = {
      user: testUsers.alice,
      drawId: "non-existing-id",
    };

    it("should return an error", async () => {
      await expect(useCase.execute(payload)).rejects.toThrowError(
        "Draw not found",
      );

      const draw = drawRepository.findByIdSync(testDraws.secretSanta.props.id);
      expect(draw).toBeDefined();
      expect(draw?.props).toEqual(testDraws.secretSanta.props);
    });
  });

  describe("Scenario: User does not organizer", () => {
    const payload = {
      user: testUsers.bob,
      drawId: testDraws.secretSanta.props.id,
    };

    it("should return an error", async () => {
      await expect(useCase.execute(payload)).rejects.toThrowError(
        "You are not allowed to update this draw",
      );

      const draw = drawRepository.findByIdSync(testDraws.secretSanta.props.id);

      expect(draw).toBeDefined();
      expect(draw?.props).toEqual(testDraws.secretSanta.props);
    });
  });

  describe("Scenario: Draw was not run", () => {
    const payload = {
      user: testUsers.bob,
      drawId: testDraws.tombola.props.id,
    };

    it("should return an error", async () => {
      await expect(useCase.execute(payload)).rejects.toThrowError(
        "The draw does not run",
      );

      const draw = drawRepository.findByIdSync(testDraws.secretSanta.props.id);

      expect(draw).toBeDefined();
      expect(draw?.props).toEqual(testDraws.secretSanta.props);
    });
  });

  describe("Scenario: Draw is already over", () => {
    const payload = {
      user: testUsers.charles,
      drawId: testDraws.drawIsAlreadyOver.props.id,
    };

    it("should return an error", async () => {
      await expect(useCase.execute(payload)).rejects.toThrowError(
        "The draw is already over",
      );

      const draw = drawRepository.findByIdSync(
        testDraws.drawIsAlreadyOver.props.id,
      );

      expect(draw).toBeDefined();
      expect(draw?.props).toEqual(testDraws.drawIsAlreadyOver.props);
    });
  });
});
