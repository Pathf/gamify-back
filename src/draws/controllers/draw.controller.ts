import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Request,
} from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { ZodValidationPipe } from "../../core/pipes/zod-validation.pipe";
import { User } from "../../users/entities/user.entity";
import { CancelDrawCommand } from "../commands/cancel-draw";
import { OrganizeDrawCommand } from "../commands/organize-draw";
import { RunDrawCommand } from "../commands/run-draw";
import { DrawsAPI } from "../contracts";

@Controller()
export class DrawController {
  constructor(private readonly commandBus: CommandBus) {}

  @Get("/draw/:id/run")
  async handleRunDraw(
    @Param("id") drawId: string,
    @Request() request: { user: User },
  ): Promise<DrawsAPI.RunDraw.Response> {
    return this.commandBus.execute(new RunDrawCommand(request.user, drawId));
  }

  @Post("/draws")
  async handleOrganizeDraw(
    @Body(new ZodValidationPipe(DrawsAPI.OrganizeDraw.schema))
    body: DrawsAPI.OrganizeDraw.Request,
    @Request() request: { user: User },
  ): Promise<DrawsAPI.OrganizeDraw.Response> {
    return this.commandBus.execute(
      new OrganizeDrawCommand(body.title, request.user.props.id, body.year),
    );
  }

  @Delete("/draw/:id")
  async handleCancelDraw(
    @Param("id") drawId: string,
    @Request() request: { user: User },
  ): Promise<DrawsAPI.CancelDraw.Response> {
    return this.commandBus.execute(new CancelDrawCommand(drawId, request.user));
  }
}
