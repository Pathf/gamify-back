import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { CommonModule } from "../core/common.module";
import { I_ID_GENERATOR } from "../core/ports/id-generator.interface";
import { I_MAILER } from "../core/ports/mailer.interface";
import { I_USER_REPOSITORY } from "../users/ports/user-repository.interface";
import { UsersModule } from "../users/users.module";
import { InMemoryConditionRepository } from "./adapters/in-memory-condition-repository";
import { InMemoryDrawRepository } from "./adapters/in-memory-draw-repository";
import { InMemoryParticipationRepository } from "./adapters/in-memory-participation-repository";
import { CancelDrawCommandHandler } from "./commands/cancel-draw";
import { CancelParticipationCommandHandler } from "./commands/cancel-participation";
import { OrganizeDrawCommandHandler } from "./commands/organize-draw";
import { RegisterConditionCommandHandler } from "./commands/register-condition";
import { RegisterParticipationCommandHandler } from "./commands/register-participation";
import { ConditionController } from "./controllers/condition.controller";
import { DrawController } from "./controllers/draw.controller";
import { ParticipationController } from "./controllers/participation.controller";
import { I_CONDITION_REPOSITORY } from "./ports/condition-repositroy.interface";
import { I_DRAW_REPOSITORY } from "./ports/draw-repository.interace";
import { I_PARTICIPATION_REPOSITORY } from "./ports/participation-repository.interface";

@Module({
  imports: [CqrsModule, CommonModule, UsersModule],
  controllers: [DrawController, ParticipationController, ConditionController],
  providers: [
    {
      provide: I_DRAW_REPOSITORY,
      useClass: InMemoryDrawRepository,
    },
    {
      provide: I_PARTICIPATION_REPOSITORY,
      useClass: InMemoryParticipationRepository,
    },
    {
      provide: I_CONDITION_REPOSITORY,
      useClass: InMemoryConditionRepository,
    },
    {
      provide: OrganizeDrawCommandHandler,
      inject: [I_DRAW_REPOSITORY, I_USER_REPOSITORY, I_ID_GENERATOR],
      useFactory: (drawRepository, userRepository, idGenerator) =>
        new OrganizeDrawCommandHandler(
          drawRepository,
          userRepository,
          idGenerator,
        ),
    },
    {
      provide: CancelDrawCommandHandler,
      inject: [
        I_DRAW_REPOSITORY,
        I_USER_REPOSITORY,
        I_PARTICIPATION_REPOSITORY,
        I_MAILER,
      ],
      useFactory: (
        drawRepository,
        userRepository,
        participationRepository,
        mailer,
      ) =>
        new CancelDrawCommandHandler(
          drawRepository,
          userRepository,
          participationRepository,
          mailer,
        ),
    },
    {
      provide: RegisterParticipationCommandHandler,
      inject: [
        I_DRAW_REPOSITORY,
        I_USER_REPOSITORY,
        I_PARTICIPATION_REPOSITORY,
      ],
      useFactory: (drawRepository, userRepository, participationRepository) =>
        new RegisterParticipationCommandHandler(
          drawRepository,
          userRepository,
          participationRepository,
        ),
    },
    {
      provide: CancelParticipationCommandHandler,
      inject: [
        I_DRAW_REPOSITORY,
        I_PARTICIPATION_REPOSITORY,
        I_USER_REPOSITORY,
      ],
      useFactory: (drawRepository, participationRepository, userRepository) =>
        new CancelParticipationCommandHandler(
          drawRepository,
          participationRepository,
          userRepository,
        ),
    },
    {
      provide: RegisterConditionCommandHandler,
      inject: [
        I_USER_REPOSITORY,
        I_DRAW_REPOSITORY,
        I_PARTICIPATION_REPOSITORY,
        I_CONDITION_REPOSITORY,
      ],
      useFactory: (
        userRepository,
        drawRepository,
        participationRepository,
        conditionRepository,
      ) =>
        new RegisterConditionCommandHandler(
          userRepository,
          drawRepository,
          participationRepository,
          conditionRepository,
        ),
    },
  ],
  exports: [
    I_DRAW_REPOSITORY,
    I_PARTICIPATION_REPOSITORY,
    I_CONDITION_REPOSITORY,
  ],
})
export class DrawsModule {}
