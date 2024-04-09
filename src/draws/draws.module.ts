import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { CommonModule } from "../core/common.module";
import { I_DATE_GENERATOR } from "../core/ports/date-generator.interface";
import { I_ID_GENERATOR } from "../core/ports/id-generator.interface";
import { I_MAILER } from "../core/ports/mailer.interface";
import { I_SHUFFLE_SERVICE } from "../core/ports/shuffle-service.interface";
import { I_USER_REPOSITORY } from "../users/ports/user-repository.interface";
import { UsersModule } from "../users/users.module";
import { InMemoryChainedDrawRepository } from "./adapters/in-memory-chained-draw-repository";
import { InMemoryConditionRepository } from "./adapters/in-memory-condition-repository";
import { InMemoryDrawRepository } from "./adapters/in-memory-draw-repository";
import { InMemoryParticipationRepository } from "./adapters/in-memory-participation-repository";
import { CancelConditionCommandHandler } from "./commands/cancel-condition";
import { CancelDrawCommandHandler } from "./commands/cancel-draw";
import { CancelParticipationCommandHandler } from "./commands/cancel-participation";
import { OrganizeDrawCommandHandler } from "./commands/organize-draw";
import { RegisterConditionCommandHandler } from "./commands/register-condition";
import { RegisterParticipationCommandHandler } from "./commands/register-participation";
import { RunDrawCommandHandler } from "./commands/run-draw";
import { ChainedDrawController } from "./controllers/chained-draw.controller";
import { ConditionController } from "./controllers/condition.controller";
import { DrawController } from "./controllers/draw.controller";
import { ParticipationController } from "./controllers/participation.controller";
import { I_CHAINED_DRAW_REPOSITORY } from "./ports/chained-draw-repository.interface";
import { I_CONDITION_REPOSITORY } from "./ports/condition-repositroy.interface";
import { I_DRAW_REPOSITORY } from "./ports/draw-repository.interace";
import { I_PARTICIPATION_REPOSITORY } from "./ports/participation-repository.interface";
import { GetDrawByParticipantIdQueryHandler } from "./queries/get-draw-by-participant-id";

@Module({
  imports: [CqrsModule, CommonModule, UsersModule],
  controllers: [
    DrawController,
    ParticipationController,
    ConditionController,
    ChainedDrawController,
  ],
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
      provide: I_CHAINED_DRAW_REPOSITORY,
      useClass: InMemoryChainedDrawRepository,
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
        I_CONDITION_REPOSITORY,
        I_MAILER,
      ],
      useFactory: (
        drawRepository,
        userRepository,
        participationRepository,
        conditionRepository,
        mailer,
      ) =>
        new CancelDrawCommandHandler(
          drawRepository,
          userRepository,
          participationRepository,
          conditionRepository,
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
        I_ID_GENERATOR,
      ],
      useFactory: (
        userRepository,
        drawRepository,
        participationRepository,
        conditionRepository,
        idGenerator,
      ) =>
        new RegisterConditionCommandHandler(
          userRepository,
          drawRepository,
          participationRepository,
          conditionRepository,
          idGenerator,
        ),
    },
    {
      provide: CancelConditionCommandHandler,
      inject: [I_CONDITION_REPOSITORY, I_USER_REPOSITORY, I_DRAW_REPOSITORY],
      useFactory: (conditionRepository, userRepository, drawRepository) =>
        new CancelConditionCommandHandler(
          conditionRepository,
          userRepository,
          drawRepository,
        ),
    },
    {
      provide: RunDrawCommandHandler,
      inject: [
        I_USER_REPOSITORY,
        I_DRAW_REPOSITORY,
        I_PARTICIPATION_REPOSITORY,
        I_CONDITION_REPOSITORY,
        I_CHAINED_DRAW_REPOSITORY,
        I_SHUFFLE_SERVICE,
        I_DATE_GENERATOR,
        I_MAILER,
      ],
      useFactory: (
        userRepository,
        drawRepository,
        participationRepository,
        conditionRepository,
        chainedDrawRepository,
        shuffleService,
        dateGenerator,
        mailer,
      ) =>
        new RunDrawCommandHandler(
          userRepository,
          drawRepository,
          participationRepository,
          conditionRepository,
          chainedDrawRepository,
          shuffleService,
          dateGenerator,
          mailer,
        ),
    },
    {
      provide: GetDrawByParticipantIdQueryHandler,
      inject: [I_DRAW_REPOSITORY, I_CHAINED_DRAW_REPOSITORY, I_USER_REPOSITORY],
      useFactory: (drawRepository, chainedDrawRepository, userRepository) =>
        new GetDrawByParticipantIdQueryHandler(
          drawRepository,
          chainedDrawRepository,
          userRepository,
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
