import { IQuery, IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { UsersDTO } from "../dto/users.dto";
import { IUserRepository } from "../ports/user-repository.interface";

export class GetUsersQuery implements IQuery {}

@QueryHandler(GetUsersQuery)
export class GetUsersQueryHandler
  implements IQueryHandler<GetUsersQuery, UsersDTO>
{
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(): Promise<UsersDTO> {
    const users = await this.userRepository.findAll();
    return users.map((user) => ({
      id: user.props.id,
      email: user.props.emailAddress,
      username: user.props.name,
    }));
  }
}
