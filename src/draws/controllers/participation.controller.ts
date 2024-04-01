import { Body, Controller, Delete, Param, Post, Request } from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { ZodValidationPipe } from "../../core/pipes/zod-validation.pipe";
import { ADMIN_ROLE, Roles, USER_ROLE } from "../../core/utils/roles.decorator";
import { User } from "../../users/entities/user.entity";
import { CancelParticipationCommand } from "../commands/cancel-participation";
import { RegisterParticipationCommand } from "../commands/register-participation";
import { DrawsAPI } from "../contracts";

@Controller()
export class ParticipationController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post("/draw/:id/participation")
  @Roles([USER_ROLE, ADMIN_ROLE])
  async handleRegisterParticipation(
    @Param("id") drawId: string,
    @Body(new ZodValidationPipe(DrawsAPI.RegisterParticipation.schema))
    body: DrawsAPI.RegisterParticipation.Request,
    @Request() request: { user: User },
  ): Promise<DrawsAPI.RegisterParticipation.Response> {
    return this.commandBus.execute(
      new RegisterParticipationCommand(
        request.user.props.id,
        drawId,
        body.participantId,
      ),
    );
  }

  @Delete("/draw/:id/participation/:participantId")
  @Roles([USER_ROLE, ADMIN_ROLE])
  async handleCancelParticipation(
    @Param("id") drawId: string,
    @Param("participantId") participantId: string,
    @Request() request: { user: User },
  ): Promise<DrawsAPI.CancelParticipation.Response> {
    return this.commandBus.execute(
      new CancelParticipationCommand(
        request.user.props.id,
        drawId,
        participantId,
      ),
    );
  }
}
