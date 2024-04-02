import { Body, Controller, Delete, Param, Post, Request } from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { ZodValidationPipe } from "../../core/pipes/zod-validation.pipe";
import { ADMIN_ROLE, Roles, USER_ROLE } from "../../core/utils/roles.decorator";
import { User } from "../../users/entities/user.entity";
import { CancelConditionCommand } from "../commands/cancel-condition";
import { RegisterConditionCommand } from "../commands/register-condition";
import { ConditionAPI } from "../contracts";

@Controller()
export class ConditionController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post("/draw/:id/condition")
  @Roles([USER_ROLE, ADMIN_ROLE])
  async handleRegisterCondition(
    @Param("id") drawId: string,
    @Body(new ZodValidationPipe(ConditionAPI.RegisterCondition.schema))
    body: ConditionAPI.RegisterCondition.Request,
    @Request() request: { user: User },
  ): Promise<ConditionAPI.RegisterCondition.Response> {
    return this.commandBus.execute(
      new RegisterConditionCommand(
        request.user,
        drawId,
        body.donorId,
        body.receiverId,
        body.isViceVersa,
      ),
    );
  }

  @Delete("/draw/:id/condition/:conditionId")
  @Roles([USER_ROLE, ADMIN_ROLE])
  async handleCancelCondition(
    @Param("id") drawId: string,
    @Param("conditionId") conditionId: string,
    @Request() request: { user: User },
  ): Promise<void> {
    return this.commandBus.execute(
      new CancelConditionCommand(request.user, drawId, conditionId),
    );
  }
}
