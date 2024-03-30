import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { CommonModule } from "../core/common.module";
import { I_ID_GENERATOR } from "../core/ports/id-generator.interface";
import { I_MAILER } from "../core/ports/mailer.interface";
import { I_USER_REPOSITORY } from "../users/ports/user-repository.interface";
import { UsersModule } from "../users/users.module";
import { InMemoryDrawRepository } from "./adapters/in-memory-draw-repository";
import { CancelDrawCommandHandler } from "./commands/cancel-draw";
import { OrganizeDrawCommandHandler } from "./commands/organize-draw";
import { DrawController } from "./controllers/draw.controller";
import { I_DRAW_REPOSITORY } from "./ports/draw-repository.interace";

@Module({
  imports: [CqrsModule, CommonModule, UsersModule],
  controllers: [DrawController],
  providers: [
    {
      provide: I_DRAW_REPOSITORY,
      useClass: InMemoryDrawRepository,
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
      inject: [I_DRAW_REPOSITORY, I_USER_REPOSITORY, I_MAILER],
      useFactory: (drawRepository, userRepository, mailer) =>
        new CancelDrawCommandHandler(drawRepository, userRepository, mailer),
    },
  ],
  exports: [I_DRAW_REPOSITORY],
})
export class DrawsModule {}
