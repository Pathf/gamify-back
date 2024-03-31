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

  public async execute(command: OrganizeDrawCommand): Promise<void> {
    const organizer = await this.userRepository.findById(command.organizerId);

    if (!organizer) {
      throw new UserNotFoundError();
    }

    const id = this.idGenerator.generate();

    const draw = new Draw({
      id,
      title: command.title,
      organizerId: command.organizerId,
      year: command.year,
    });

    await this.drawRepository.create(draw);
  }
}
