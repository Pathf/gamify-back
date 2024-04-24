import { Body, Controller, Delete, Param, Post, Request } from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { ApiTags } from "@nestjs/swagger";
import { ZodValidationPipe } from "../../core/pipes/zod-validation.pipe";
import { User } from "../../users/entities/user.entity";
import { CancelParticipationCommand } from "../commands/cancel-participation";
import { RegisterParticipationCommand } from "../commands/register-participation";
import { ParticipationAPI } from "../contracts";

@ApiTags("draws")
@Controller()
export class ParticipationController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post("/draw/:id/participation")
  async handleRegisterParticipation(
    @Param("id") drawId: string,
    @Body(new ZodValidationPipe(ParticipationAPI.RegisterParticipation.schema))
    body: ParticipationAPI.RegisterParticipation.Request,
    @Request() request: { user: User },
  ): Promise<ParticipationAPI.RegisterParticipation.Response> {
    return this.commandBus.execute(
      new RegisterParticipationCommand(
        request.user.props.id,
        drawId,
        body.participantId,
      ),
    );
  }

  @Delete("/draw/:id/participation/:participantId")
  async handleCancelParticipation(
    @Param("id") drawId: string,
    @Param("participantId") participantId: string,
    @Request() request: { user: User },
  ): Promise<ParticipationAPI.CancelParticipation.Response> {
    return this.commandBus.execute(
      new CancelParticipationCommand(
        request.user.props.id,
        drawId,
        participantId,
      ),
    );
  }
}
