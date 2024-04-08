import { IQuery, IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { UserDTO } from "../dto/user.dto";
import { UserNotFoundError } from "../errors/user-not-found.error";
import { IUserRepository } from "../ports/user-repository.interface";

export class GetUserByIdQuery implements IQuery {
  constructor(public readonly userId: string) {}
}

@QueryHandler(GetUserByIdQuery)
export class GetUserByIdQueryHandler
  implements IQueryHandler<GetUserByIdQuery, UserDTO>
{
  constructor(private readonly userRepository: IUserRepository) {}

  async execute({ userId }: GetUserByIdQuery): Promise<UserDTO> {
    const user = await this.userRepository.findOne(userId);

    if (!user) {
      throw new UserNotFoundError();
    }

    return {
      id: user.props.id,
      email: user.props.emailAddress,
      username: user.props.name,
    };
  }
}
