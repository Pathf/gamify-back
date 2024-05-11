import { CommandHandler, ICommand, ICommandHandler } from "@nestjs/cqrs";
import { IMailer } from "../../core/ports/mailer.interface";
import { User } from "../../users/entities/user.entity";
import { IUserRepository } from "../../users/ports/user-repository.interface";
import { Draw } from "../entities/draw.entity";
import { DrawNotFoundError } from "../errors/draw-not-found.error";
import { NotAllowedUpdateDrawError } from "../errors/not-allowed-update-draw.error";
import { IChainedDrawRepository } from "../ports/chained-draw-repository.interface";
import { IConditionRepository } from "../ports/condition-repositroy.interface";
import { IDrawRepository } from "../ports/draw-repository.interace";
import { IParticipationRepository } from "../ports/participation-repository.interface";

type Response = void;

export class CancelDrawCommand implements ICommand {
  constructor(
    public readonly drawId: string,
    public readonly user: User,
  ) {}
}

@CommandHandler(CancelDrawCommand)
export class CancelDrawCommandHandler
  implements ICommandHandler<CancelDrawCommand, Response>
{
  constructor(
    private readonly drawRepository: IDrawRepository,
    private readonly userRepository: IUserRepository,
    private readonly participationRepository: IParticipationRepository,
    private readonly conditionRepository: IConditionRepository,
    private readonly chainedDrawRepository: IChainedDrawRepository,
    private readonly mailer: IMailer,
  ) {}

  async execute({ drawId, user }: CancelDrawCommand) {
    const draw = await this.assertDrawExists(drawId);
    this.assertUserIsOrganizer(user, draw);

    const participants = await this.getParticipants(drawId);

    await this.removeDrawAndWhatConcernsIt(drawId);

    await this.sendEmailsToParticipants(participants, draw);
  }

  private async assertDrawExists(drawId: string): Promise<Draw> {
    const draw = await this.drawRepository.findOne(drawId);
    if (!draw) {
      throw new DrawNotFoundError();
    }
    return draw;
  }

  private assertUserIsOrganizer(user: User, draw: Draw) {
    if (!draw.isOrganizer(user)) {
      throw new NotAllowedUpdateDrawError();
    }
  }

  private async getParticipants(drawId: string) {
    const participations =
      await this.participationRepository.findAllParticipationByDrawId(drawId);
    return await this.userRepository.findByIds(
      participations.map((p) => p.props.participantId),
    );
  }

  private async removeDrawAndWhatConcernsIt(drawId: string) {
    await this.chainedDrawRepository.deleteAllByDrawId(drawId);
    await this.conditionRepository.deleteByDrawId(drawId);
    await this.participationRepository.deleteByDrawId(drawId);
    await this.drawRepository.delete(drawId);
  }

  private async sendEmailsToParticipants(participants: User[], draw: Draw) {
    for (const participant of participants) {
      await this.mailer.send({
        to: participant.props.emailAddress,
        subject: "Draw canceled",
        body: `The draw ${draw.props.title} has been canceled`,
      });
    }
  }
}
