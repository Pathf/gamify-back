import { INestApplication } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { Test } from "@nestjs/testing";
import { AppModule } from "../../core/app.module";
import {
  IChainedDrawRepository,
  I_CHAINED_DRAW_REPOSITORY,
} from "../../draws/ports/chained-draw-repository.interface";
import {
  IConditionRepository,
  I_CONDITION_REPOSITORY,
} from "../../draws/ports/condition-repositroy.interface";
import {
  IDrawRepository,
  I_DRAW_REPOSITORY,
} from "../../draws/ports/draw-repository.interace";
import {
  IParticipationRepository,
  I_PARTICIPATION_REPOSITORY,
} from "../../draws/ports/participation-repository.interface";
import {
  ICodeRepository,
  I_CODE_REPOSITORY,
} from "../../users/ports/code-repository.interface";
import {
  IUserRepository,
  I_USER_REPOSITORY,
} from "../../users/ports/user-repository.interface";
import { IFixture } from "./fixture";

export class TestApp {
  private app: INestApplication;

  async setup() {
    const module = await Test.createTestingModule({
      imports: [AppModule, ConfigModule.forRoot({ isGlobal: true })],
    }).compile();

    this.app = module.createNestApplication();
    await this.app.init();

    await this.clearDatabase();
  }

  async cleanup() {
    await this.app.close();
  }

  async loadFixture(fixtures: IFixture[]) {
    return Promise.all(fixtures.map((fixture) => fixture.load(this)));
  }

  getHttpServer() {
    return this.app.getHttpServer();
  }

  get<T>(name: any) {
    return this.app.get<T>(name);
  }

  private async clearDatabase() {
    await this.app.get<IUserRepository>(I_USER_REPOSITORY).deleteAll();
    await this.app.get<IDrawRepository>(I_DRAW_REPOSITORY).deleteAll();
    await this.app
      .get<IParticipationRepository>(I_PARTICIPATION_REPOSITORY)
      .deleteAll();
    await this.app
      .get<IConditionRepository>(I_CONDITION_REPOSITORY)
      .deleteAll();
    await this.app
      .get<IChainedDrawRepository>(I_CHAINED_DRAW_REPOSITORY)
      .deleteAll();
    await this.app.get<ICodeRepository>(I_CODE_REPOSITORY).deleteAll();
  }
}
