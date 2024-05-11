import { InMemoryUserRepository } from "../adapters/in-memory/in-memory-user-repository";
import { testUsers } from "../tests/user-seeds";
import { GetUsersQueryHandler } from "./get-users";

describe("Feature: Get Users", () => {
  let userRepository: InMemoryUserRepository;
  let queryhandler: GetUsersQueryHandler;

  beforeAll(() => {
    userRepository = new InMemoryUserRepository([
      testUsers.alice,
      testUsers.bob,
    ]);
    queryhandler = new GetUsersQueryHandler(userRepository);
  });

  describe("Scenario: Happy Path", () => {
    it("should return users list", async () => {
      const result = await queryhandler.execute();

      expect(result).toEqual(
        expect.arrayContaining([
          {
            id: testUsers.alice.props.id,
            email: testUsers.alice.props.emailAddress,
            username: testUsers.alice.props.name,
          },
          {
            id: testUsers.bob.props.id,
            email: testUsers.bob.props.emailAddress,
            username: testUsers.bob.props.name,
          },
        ]),
      );
    });
  });
});
