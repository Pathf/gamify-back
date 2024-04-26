import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CommonModule } from "../core/common.module";
import { I_DATE_GENERATOR } from "../core/ports/date-generator.interface";
import { I_ID_GENERATOR } from "../core/ports/id-generator.interface";
import { I_MAILER } from "../core/ports/mailer.interface";
import { I_SHUFFLE_SERVICE } from "../core/ports/shuffle-service.interface";
import { I_USER_REPOSITORY } from "../users/ports/user-repository.interface";
import { UsersModule } from "../users/users.module";
import { PostgresChainedDraw } from "./adapters/postgres/chained-draw/postgres-chained-draw";
import { PostgresChainedDrawRepository } from "./adapters/postgres/chained-draw/postgres-chained-draw-repository";
import { PostgresCondition } from "./adapters/postgres/condition/postgres-condition";
import { PostgresConditionRepository } from "./adapters/postgres/condition/postgres-condition-repository";
import { PostgresDraw } from "./adapters/postgres/draw/postgres-draw";
import { PostgresDrawRepository } from "./adapters/postgres/draw/postgres-draw-repository";
import { PostgresParticipation } from "./adapters/postgres/participation/postgres-participation";
import { PostgresParticipationRepository } from "./adapters/postgres/participation/postgres-participation-repository";
import { CancelConditionCommandHandler } from "./commands/cancel-condition";
import { CancelDrawCommandHandler } from "./commands/cancel-draw";
import { CancelParticipationCommandHandler } from "./commands/cancel-participation";
import { CloseDrawCommandHandler } from "./commands/close-draw";
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
import { GetDrawByIdQueryHandler } from "./queries/get-draw-by-id";
import { GetDrawByParticipantIdQueryHandler } from "./queries/get-draw-by-participant-id";
import { GetDrawsQueryHandler } from "./queries/get-draws";

@Module({
  imports: [
    CqrsModule,
    CommonModule,
    UsersModule,
    TypeOrmModule.forFeature([
      PostgresDraw,
      PostgresParticipation,
      PostgresCondition,
      PostgresChainedDraw,
    ]),
  ],
  controllers: [
    DrawController,
    ParticipationController,
    ConditionController,
    ChainedDrawController,
  ],
  providers: [
    {
      provide: I_DRAW_REPOSITORY,
      useClass: PostgresDrawRepository,
    },
    {
      provide: I_PARTICIPATION_REPOSITORY,
      useClass: PostgresParticipationRepository,
    },
    {
      provide: I_CONDITION_REPOSITORY,
      useClass: PostgresConditionRepository,
    },
    {
      provide: I_CHAINED_DRAW_REPOSITORY,
      useClass: PostgresChainedDrawRepository,
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
      provide: CloseDrawCommandHandler,
      inject: [I_DRAW_REPOSITORY, I_CHAINED_DRAW_REPOSITORY],
      useFactory: (drawRepository, chainedDrawRepository) =>
        new CloseDrawCommandHandler(drawRepository, chainedDrawRepository),
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
    {
      provide: GetDrawByIdQueryHandler,
      inject: [I_DRAW_REPOSITORY, I_CHAINED_DRAW_REPOSITORY, I_USER_REPOSITORY],
      useFactory: (drawRepository, chainedDrawRepository, userRepository) =>
        new GetDrawByIdQueryHandler(
          drawRepository,
          chainedDrawRepository,
          userRepository,
        ),
    },
    {
      provide: GetDrawsQueryHandler,
      inject: [I_DRAW_REPOSITORY, I_CHAINED_DRAW_REPOSITORY, I_USER_REPOSITORY],
      useFactory: (drawRepository, chainedDrawRepository, userRepository) =>
        new GetDrawsQueryHandler(
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
