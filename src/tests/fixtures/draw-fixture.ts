import { Draw } from "../../draws/entities/draw.entity";
import {
  IDrawRepository,
  I_DRAW_REPOSITORY,
} from "../../draws/ports/draw-repository.interace";
import { IFixture } from "../utils/fixture";
import { TestApp } from "../utils/test-app";

export class DrawFixture implements IFixture {
  constructor(public readonly entity: Draw) {}

  async load(app: TestApp): Promise<void> {
    const drawRepository = app.get<IDrawRepository>(I_DRAW_REPOSITORY);
    await drawRepository.create(this.entity);
  }
}
