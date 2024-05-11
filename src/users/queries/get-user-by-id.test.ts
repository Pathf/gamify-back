import { InMemoryUserRepository } from "../adapters/in-memory/in-memory-user-repository";
import { testUsers } from "../tests/user-seeds";
import { GetUserByIdQueryHandler } from "./get-user-by-id";

describe("Feature: Get Users", () => {
  let userRepository: InMemoryUserRepository;
  let queryhandler: GetUserByIdQueryHandler;

  beforeAll(() => {
    userRepository = new InMemoryUserRepository([testUsers.alice]);
    queryhandler = new GetUserByIdQueryHandler(userRepository);
  });

  describe("Scenario: Happy Path", () => {
    const payload = { userId: testUsers.alice.props.id };

    it("should return user", async () => {
      const result = await queryhandler.execute(payload);

      expect(result).toEqual({
        id: testUsers.alice.props.id,
        email: testUsers.alice.props.emailAddress,
        username: testUsers.alice.props.name,
      });
    });
  });

  describe("Scenario: User not found", () => {
    const payload = { userId: "unknown" };

    it("should throw UserNotFoundError", async () => {
      await expect(queryhandler.execute(payload)).rejects.toThrowError(
        "User not found",
      );
    });
  });
});
