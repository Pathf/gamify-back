import { IQuery, IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { UserDTO } from "../../users/dto/user.dto";
import { User } from "../../users/entities/user.entity";
import { IUserRepository } from "../../users/ports/user-repository.interface";
import { DrawsDTO, StateDrawDTO } from "../dto/draws.dto";
import { Draw } from "../entities/draw.entity";
import { OrganizerDoesNotExistError } from "../errors/organizer-does-not-exist.error";
import { IChainedDrawRepository } from "../ports/chained-draw-repository.interface";
import { IDrawRepository } from "../ports/draw-repository.interace";

export class GetDrawsQuery implements IQuery {}

@QueryHandler(GetDrawsQuery)
export class GetDrawsQueryHandler
  implements IQueryHandler<GetDrawsQuery, DrawsDTO>
{
  private readonly mapper = new Mapper();

  constructor(
    private readonly drawRepository: IDrawRepository,
    private readonly chainedDrawRepository: IChainedDrawRepository,
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(_: GetDrawsQuery): Promise<DrawsDTO> {
    const draws = await this.drawRepository.findAll();

    const drawsDTO = await Promise.all(
      draws.map(async (draw) => this.buildDrawDTO(draw)),
    );

    return drawsDTO;
  }

  private async assertOrganizerExists(organizerId: string): Promise<User> {
    const organizer = await this.userRepository.findOne(organizerId);
    if (!organizer) {
      throw new OrganizerDoesNotExistError();
    }
    return organizer;
  }

  private async buildDrawDTO(draw: Draw): Promise<StateDrawDTO> {
    const { id, organizerId } = draw.props;
    const organizer = await this.assertOrganizerExists(organizerId);
    const runDrawDate = await this.chainedDrawRepository.findRunDrawDate(id);
    return this.mapper.toDrawDTO(draw, organizer, runDrawDate);
  }
}

class Mapper {
  toDrawDTO(
    draw: Draw,
    organizer: User,
    runDrawDate: Date | null,
  ): StateDrawDTO {
    return {
      id: draw.props.id,
      title: draw.props.title,
      year: draw.props.year,
      organizer: this.toUserDTO(organizer),
      runDrawDate: runDrawDate ? runDrawDate.toISOString() : null,
    };
  }

  private toUserDTO(organizer: User): UserDTO {
    return {
      id: organizer.props.id,
      email: organizer.props.emailAddress,
      username: organizer.props.name,
    };
  }
}
