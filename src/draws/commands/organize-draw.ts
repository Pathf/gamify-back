import { CommandHandler, ICommand, ICommandHandler } from "@nestjs/cqrs";
import { IIDGenerator } from "../../core/ports/id-generator.interface";
import { UserNotFoundError } from "../../users/errors/user-not-found.error";
import { IUserRepository } from "../../users/ports/user-repository.interface";
import { Draw } from "../entities/draw.entity";
import { IDrawRepository } from "../ports/draw-repository.interace";

type Response = void;

export class OrganizeDrawCommand implements ICommand {
  constructor(
    public title: string,
    public organizerId: string,
    public year: number,
  ) {}
}

@CommandHandler(OrganizeDrawCommand)
export class OrganizeDrawCommandHandler
  implements ICommandHandler<OrganizeDrawCommand, Response>
{
  constructor(
    private readonly drawRepository: IDrawRepository,
    private readonly userRepository: IUserRepository,
    private readonly idGenerator: IIDGenerator,
  ) {}

  public async execute({
    title,
    organizerId,
    year,
  }: OrganizeDrawCommand): Promise<void> {
    await this.assertOrganizerExists(organizerId);

    await this.createDraw(title, organizerId, year);
  }

  private async assertOrganizerExists(organizerId: string) {
    const organizer = await this.userRepository.findOne(organizerId);

    if (!organizer) {
      throw new UserNotFoundError();
    }
  }

  private async createDraw(title: string, organizerId: string, year: number) {
    const id = this.idGenerator.generate();

    const draw = new Draw({
      id,
      title,
      organizerId,
      year,
      isFinish: false,
    });

    await this.drawRepository.create(draw);
  }
}
