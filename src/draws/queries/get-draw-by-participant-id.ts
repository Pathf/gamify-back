import { IQuery, IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { UserDTO } from "../../users/dto/user.dto";
import { User } from "../../users/entities/user.entity";
import { IUserRepository } from "../../users/ports/user-repository.interface";
import {
  DrawDTO,
  ParticipantDTO,
  ParticipantResultDTO,
} from "../dto/participant-result.dto";
import { ChainedDraw } from "../entities/chained-draw.entity";
import { Draw } from "../entities/draw.entity";
import { DonorDoesNotExistError } from "../errors/donor-does-not-exist.error";
import { DrawDoesNotRunError } from "../errors/draw-does-not-run.error";
import { DrawNotFoundError } from "../errors/draw-not-found.error";
import { OrganizerDoesNotExistError } from "../errors/organizer-does-not-exist.error";
import { RecieverDoesNotExistError } from "../errors/reciever-does-not-exist.error";
import { IChainedDrawRepository } from "../ports/chained-draw-repository.interface";
import { IDrawRepository } from "../ports/draw-repository.interace";

export class GetDrawByParticipantIdQuery implements IQuery {
  constructor(
    public readonly drawId: string,
    public readonly participantId: string,
  ) {}
}

@QueryHandler(GetDrawByParticipantIdQuery)
export class GetDrawByParticipantIdQueryHandler
  implements IQueryHandler<GetDrawByParticipantIdQuery, ParticipantResultDTO>
{
  private readonly mapper = new Mapper();

  constructor(
    private readonly drawRepository: IDrawRepository,
    private readonly chainedDrawRepository: IChainedDrawRepository,
    private readonly userRepository: IUserRepository,
  ) {}

  async execute({
    drawId,
    participantId,
  }: GetDrawByParticipantIdQuery): Promise<ParticipantResultDTO> {
    const draw = await this.assertDrawExist(drawId);
    const organizer = await this.assertOrganizerExist(draw.props.organizerId);
    const donor = await this.assertDonorExist(participantId);
    const chainedDraw = await this.assertDrawHasRun(drawId, donor.props.id);
    const receiver = await this.assertRecieverExist(
      chainedDraw.props.receiverId,
    );

    return {
      donor: this.mapper.toParticipantDTO(donor),
      reveiver: this.mapper.toParticipantDTO(receiver),
      draw: this.mapper.toDrawDTO(draw, organizer),
    };
  }

  private async assertDrawExist(drawId: string): Promise<Draw> {
    const draw = await this.drawRepository.findOne(drawId);
    if (!draw) {
      throw new DrawNotFoundError();
    }
    return draw;
  }

  private async assertOrganizerExist(organizerId: string): Promise<User> {
    const organizer = await this.userRepository.findOne(organizerId);
    if (!organizer) {
      throw new OrganizerDoesNotExistError();
    }
    return organizer;
  }

  private async assertDonorExist(donorId: string): Promise<User> {
    const donor = await this.userRepository.findOne(donorId);
    if (!donor) {
      throw new DonorDoesNotExistError();
    }
    return donor;
  }

  private async assertDrawHasRun(
    drawId: string,
    donorId: string,
  ): Promise<ChainedDraw> {
    const chainedDraw = await this.chainedDrawRepository.findByDonorId(
      drawId,
      donorId,
    );
    if (!chainedDraw) {
      throw new DrawDoesNotRunError();
    }
    return chainedDraw;
  }

  private async assertRecieverExist(receiverId: string): Promise<User> {
    const receiver = await this.userRepository.findOne(receiverId);
    if (!receiver) {
      throw new RecieverDoesNotExistError();
    }
    return receiver;
  }
}

class Mapper {
  toParticipantDTO(user: User): ParticipantDTO {
    return {
      id: user.props.id,
      name: user.props.name,
    };
  }

  toDrawDTO(draw: Draw, organizer: User): DrawDTO {
    return {
      id: draw.props.id,
      title: draw.props.title,
      year: draw.props.year,
      organizer: this.toOrganizerDTO(organizer),
    };
  }

  private toOrganizerDTO(user: User): UserDTO {
    return {
      id: user.props.id,
      username: user.props.name,
      email: user.props.emailAddress,
    };
  }
}
