import { IQuery, IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { UserMapper } from "../../users/dto/user.dto";
import { IUserRepository } from "../../users/ports/user-repository.interface";
import { ChainedDrawResultDTO } from "../dto/chained-draw-result.dto";
import { ParticipantMapper } from "../dto/participant-result.dto";
import { DonorDoesNotExistError } from "../errors/donor-does-not-exist.error";
import { DrawNotFoundError } from "../errors/draw-not-found.error";
import { OrganizerDoesNotExistError } from "../errors/organizer-does-not-exist.error";
import { RecieverDoesNotExistError } from "../errors/reciever-does-not-exist.error";
import { IChainedDrawRepository } from "../ports/chained-draw-repository.interface";
import { IDrawRepository } from "../ports/draw-repository.interace";

type Request = GetChainedDrawsByIdParticipantQuery;
type Response = ChainedDrawResultDTO[];

export class GetChainedDrawsByIdParticipantQuery implements IQuery {
  constructor(public readonly participantId: string) {}
}

@QueryHandler(GetChainedDrawsByIdParticipantQuery)
export class GetChainedDrawsByIdParticipantQueryHandler
  implements IQueryHandler<Request, Response>
{
  private readonly userMapper = new UserMapper();
  private readonly participantMapper = new ParticipantMapper();

  constructor(
    private readonly userRepository: IUserRepository,
    private readonly drawRepository: IDrawRepository,
    private readonly chainedDrawRepository: IChainedDrawRepository,
  ) {}

  async execute({ participantId }: Request): Promise<Response> {
    const donor = await this.assertDonorExist(participantId);
    const chainedDraws =
      await this.chainedDrawRepository.findAllByDonorId(participantId);

    const chainedDrawDTOs: Response = [];

    for (const chainedDraw of chainedDraws) {
      const { drawId, receiverId, dateDraw } = chainedDraw.props;

      const draw = await this.assertDrawExist(drawId);
      const { id, organizerId, title, year } = draw.props;

      const organizer = await this.assertOrganizerExist(organizerId);
      const receiver = await this.assertReceiverExist(receiverId);

      chainedDrawDTOs.push({
        id,
        title,
        year,
        runDrawDate: dateDraw.toISOString(),
        organizer: this.userMapper.toDTO(organizer),
        donor: this.participantMapper.toDTO(donor),
        receiver: this.participantMapper.toDTO(receiver),
      });
    }

    return chainedDrawDTOs;
  }

  private async assertDrawExist(drawId: string) {
    const draw = await this.drawRepository.findOne(drawId);
    if (!draw) {
      throw new DrawNotFoundError();
    }
    return draw;
  }

  private async assertOrganizerExist(organizerId: string) {
    const organizer = await this.userRepository.findOne(organizerId);
    if (!organizer) {
      throw new OrganizerDoesNotExistError();
    }
    return organizer;
  }

  private async assertDonorExist(donorId: string) {
    const donor = await this.userRepository.findOne(donorId);
    if (!donor) {
      throw new DonorDoesNotExistError();
    }
    return donor;
  }

  private async assertReceiverExist(receiverId: string) {
    const receiver = await this.userRepository.findOne(receiverId);
    if (!receiver) {
      throw new RecieverDoesNotExistError();
    }
    return receiver;
  }
}
