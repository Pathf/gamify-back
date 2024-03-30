import { FixedIDGenerator } from "../../core/adapters/fixed-id-generator";
import { IIDGenerator } from "../../core/ports/id-generator.interface";
import { InMemoryUserRepository } from "../../users/adapters/in-memory-user-repository";
import { testUsers } from "../../users/tests/user-seeds";
import { InMemoryDrawRepository } from "../adapters/in-memory-draw-repository";
import { testDraws } from "../tests/draw-seeds";
import { OrganizeDrawCommandHandler } from "./organize-draw";

describe("Feature: Organizing Draw", () => {
  let useCase: OrganizeDrawCommandHandler;
  let drawRepository: InMemoryDrawRepository;
  let userRepository: InMemoryUserRepository;
  let idGenerator: IIDGenerator;

  beforeEach(() => {
    drawRepository = new InMemoryDrawRepository();
    userRepository = new InMemoryUserRepository([testUsers.alice]);
    idGenerator = new FixedIDGenerator();
    useCase = new OrganizeDrawCommandHandler(
      drawRepository,
      userRepository,
      idGenerator,
    );
  });

  describe("Scenario: happy path", () => {
    const payload = {
      title: testDraws.secretSanta.props.title,
      organizerId: testDraws.secretSanta.props.organizerId,
      year: testDraws.secretSanta.props.year,
    };

    it("should organize draw", async () => {
      await useCase.execute(payload);

      const draw = await drawRepository.findById("id-1");

      expect(draw?.props).toEqual({
        id: "id-1",
        title: testDraws.secretSanta.props.title,
        organizerId: testDraws.secretSanta.props.organizerId,
        year: testDraws.secretSanta.props.year,
      });
    });
  });

  describe("Scenario: organizer does not exist", () => {
    const payload = {
      title: testDraws.secretSanta.props.title,
      organizerId: "unknown-organizer-id",
      year: testDraws.secretSanta.props.year,
    };

    it("should fail", async () => {
      await expect(useCase.execute(payload)).rejects.toThrowError(
        "User not found",
      );

      expect(drawRepository.draws).toEqual([]);
    });
  });
});
