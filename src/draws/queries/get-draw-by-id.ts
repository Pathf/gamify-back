import { IQuery, IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { UserDTO } from "../../users/dto/user.dto";
import { User } from "../../users/entities/user.entity";
import { IUserRepository } from "../../users/ports/user-repository.interface";
import { ChainedDrawDTO, DrawResultDTO } from "../dto/draw-result.dto";
import { ParticipantDTO } from "../dto/participant-result.dto";
import { ChainedDraw } from "../entities/chained-draw.entity";
import { Draw } from "../entities/draw.entity";
import { DonorDoesNotExistError } from "../errors/donor-does-not-exist.error";
import { DrawDoesNotRunError } from "../errors/draw-does-not-run.error";
import { DrawNotFoundError } from "../errors/draw-not-found.error";
import { OrganizerDoesNotExistError } from "../errors/organizer-does-not-exist.error";
import { RecieverDoesNotExistError } from "../errors/reciever-does-not-exist.error";
import { IChainedDrawRepository } from "../ports/chained-draw-repository.interface";
import { IDrawRepository } from "../ports/draw-repository.interace";

export class GetDrawByIdQuery implements IQuery {
  constructor(public readonly drawId: string) {}
}

@QueryHandler(GetDrawByIdQuery)
export class GetDrawByIdQueryHandler
  implements IQueryHandler<GetDrawByIdQuery, DrawResultDTO>
{
  private readonly mapper = new Mapper();

  constructor(
    private readonly drawRepository: IDrawRepository,
    private readonly chainedDrawRepository: IChainedDrawRepository,
    private readonly userRepository: IUserRepository,
  ) {}

  async execute({ drawId }: GetDrawByIdQuery): Promise<DrawResultDTO> {
    const draw = await this.assertDrawExists(drawId);
    const organizer = await this.assertOrganiserExists(draw.props.organizerId);
    const chainedDraws = await this.assertDrawHasRun(drawId);
    const chainedDrawDTOs = await this.buildChainedDrawDTOs(chainedDraws);

    return {
      id: draw.props.id,
      title: draw.props.title,
      year: draw.props.year,
      runDrawDate: chainedDraws[0].props.dateDraw.toISOString(),
      organizer: this.mapper.toUserDTO(organizer),
      chainedDraws: chainedDrawDTOs,
    };
  }

  private async assertDrawExists(drawId: string): Promise<Draw> {
    const draw = await this.drawRepository.findOne(drawId);
    if (!draw) {
      throw new DrawNotFoundError();
    }
    return draw;
  }

  private async assertOrganiserExists(organizerId: string): Promise<User> {
    const organizer = await this.userRepository.findOne(organizerId);
    if (!organizer) {
      throw new OrganizerDoesNotExistError();
    }
    return organizer;
  }

  private async assertDrawHasRun(drawId: string): Promise<ChainedDraw[]> {
    const chainedDraws = await this.chainedDrawRepository.findByDrawId(drawId);
    if (chainedDraws.length === 0) {
      throw new DrawDoesNotRunError();
    }
    return chainedDraws;
  }

  private async assertDonorExists(donorId: string): Promise<User> {
    const donor = await this.userRepository.findOne(donorId);
    if (!donor) {
      throw new DonorDoesNotExistError();
    }
    return donor;
  }

  private async assertReceiverExists(receiverId: string): Promise<User> {
    const receiver = await this.userRepository.findOne(receiverId);
    if (!receiver) {
      throw new RecieverDoesNotExistError();
    }
    return receiver;
  }

  private async buildChainedDrawDTOs(
    chainedDraws: ChainedDraw[],
  ): Promise<ChainedDrawDTO[]> {
    const chainedDrawDTOs: ChainedDrawDTO[] = [];
    for (const { props } of chainedDraws) {
      const donor = await this.assertDonorExists(props.donorId);
      const receiver = await this.assertReceiverExists(props.receiverId);
      const chainedDrawDTO = this.mapper.toChainedDrawDTO(donor, receiver);
      chainedDrawDTOs.push(chainedDrawDTO);
    }
    return chainedDrawDTOs;
  }
}

class Mapper {
  toChainedDrawDTO(donor: User, receiver: User): ChainedDrawDTO {
    return {
      donor: this.toParticipantDTO(donor),
      receiver: this.toParticipantDTO(receiver),
    };
  }

  toUserDTO(organizer: User): UserDTO {
    return {
      id: organizer.props.id,
      email: organizer.props.emailAddress,
      username: organizer.props.name,
    };
  }

  private toParticipantDTO(user: User): ParticipantDTO {
    return {
      id: user.props.id,
      name: user.props.name,
    };
  }
}
