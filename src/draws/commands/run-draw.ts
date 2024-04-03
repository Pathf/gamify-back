import { CommandHandler, ICommand, ICommandHandler } from "@nestjs/cqrs";
import { IDateGenerator } from "../../core/ports/date-generator.interface";
import { Email, IMailer } from "../../core/ports/mailer.interface";
import { IShuffleService } from "../../core/ports/shuffle-service.interface";
import { generateAllPermutation } from "../../core/utils/generate-permutation";
import { User } from "../../users/entities/user.entity";
import { IUserRepository } from "../../users/ports/user-repository.interface";
import { ChainedDraw } from "../entities/chained-draw.entity";
import { Draw } from "../entities/draw.entity";
import { Participation } from "../entities/participation.entity";
import { DrawMustHaveLeastThreeParticipantsError } from "../errors/draw-must-have-least-three-participants.error";
import { DrawNotFoundError } from "../errors/draw-not-found.error";
import { OnlyOrganizerCanRunDrawError } from "../errors/only-organizer-can-run-draw.error";
import { ParticipantDoesNotExistError } from "../errors/participant-does-not-exist.error";
import { RunDrawWithActualConditionsIsImpossibleError } from "../errors/run-draw-with-actual-conditions-is-impossible.error";
import { IChainedDrawRepository } from "../ports/chained-draw-repository.interface";
import { IConditionRepository } from "../ports/condition-repositroy.interface";
import { IDrawRepository } from "../ports/draw-repository.interace";
import { IParticipationRepository } from "../ports/participation-repository.interface";
import {
  countCorresponding,
  generateAllConditionAtTest,
} from "../utils/condition.utils";

type Response = void;

export class RunDrawCommand implements ICommand {
  constructor(
    public readonly user: User,
    public readonly drawId: string,
  ) {}
}

@CommandHandler(RunDrawCommand)
export class RunDrawCommandHandler
  implements ICommandHandler<RunDrawCommand, Response>
{
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly drawRepository: IDrawRepository,
    private readonly participationRepository: IParticipationRepository,
    private readonly conditionRepository: IConditionRepository,
    private readonly chainedDrawRepository: IChainedDrawRepository,
    private readonly shuffleService: IShuffleService,
    private readonly dateGenerator: IDateGenerator,
    private readonly mailer: IMailer,
  ) {}

  async execute({ user, drawId }: RunDrawCommand): Promise<void> {
    const draw = await this.assertDrawExist(drawId);
    this.assertUserIsOrganizer(draw, user);
    const participations =
      await this.assertMustHaveAtLeast3Participants(drawId);
    await this.assertRunDrawWithActualConditions(drawId);

    const shuffledParticipations = this.shuffleService.shuffle(
      participations.map((p) => p.props.participantId),
    );
    const dateDraw = this.dateGenerator.now();
    const chainedDraws: ChainedDraw[] = [];
    const mails: Email[] = [];

    for (let i = 0; i < shuffledParticipations.length; i++) {
      const donor = await this.assertParticipantExist(
        shuffledParticipations[i],
      );
      const receiver = await this.assertParticipantExist(
        shuffledParticipations[(i + 1) % shuffledParticipations.length],
      );
      const chainedDraw = new ChainedDraw({
        drawId,
        donorId: donor.props.id,
        receiverId: receiver.props.id,
        dateDraw,
      });

      chainedDraws.push(chainedDraw);
      mails.push({
        to: donor.props.emailAddress,
        subject: "Secret Santa Draw",
        body: `You are the Secret Santa of ${receiver.props.name}`,
      });
    }

    mails.push({
      to: user.props.emailAddress,
      subject: "Secret Santa Draw",
      body: "The Secret Santa draw has been completed",
    });

    await this.createChainedDraws(chainedDraws);
    await this.sendEmails(mails);
  }

  private async assertDrawExist(drawId: string): Promise<Draw> {
    const draw = await this.drawRepository.findOne(drawId);
    if (!draw) {
      throw new DrawNotFoundError();
    }
    return draw;
  }

  private assertUserIsOrganizer(draw: Draw, user: User): void {
    if (!draw.isOrganizer(user)) {
      throw new OnlyOrganizerCanRunDrawError();
    }
  }

  private async assertMustHaveAtLeast3Participants(
    drawId: string,
  ): Promise<Participation[]> {
    const participations =
      await this.participationRepository.findAllParticipationByDrawId(drawId);

    if (participations.length < 3) {
      throw new DrawMustHaveLeastThreeParticipantsError();
    }

    return participations;
  }

  private async assertParticipantExist(participantId: string): Promise<User> {
    const participant = await this.userRepository.findOne(participantId);

    if (!participant) {
      throw new ParticipantDoesNotExistError();
    }
    return participant;
  }

  private async assertRunDrawWithActualConditions(drawId: string) {
    const participationIds = (
      await this.participationRepository.findAllParticipationByDrawId(drawId)
    ).map((participation) => participation.props.participantId);

    const conditions = await this.conditionRepository.findAllByDrawId(drawId);
    const permutations = generateAllPermutation(participationIds);
    const conditionsAtTest = generateAllConditionAtTest(conditions);

    const correspondingCount = countCorresponding(
      permutations,
      conditionsAtTest,
    );

    if (permutations.length - correspondingCount <= 0) {
      throw new RunDrawWithActualConditionsIsImpossibleError();
    }
  }

  private async createChainedDraws(chainedDraws: ChainedDraw[]) {
    for (const chainedDraw of chainedDraws) {
      await this.chainedDrawRepository.create(chainedDraw);
    }
  }

  private async sendEmails(emails: Email[]) {
    for (const email of emails) {
      await this.mailer.send(email);
    }
  }
}
