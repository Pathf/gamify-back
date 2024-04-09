import { ChainedDraw } from "../../draws/entities/chained-draw.entity";
import {
  IChainedDrawRepository,
  I_CHAINED_DRAW_REPOSITORY,
} from "../../draws/ports/chained-draw-repository.interface";
import { IFixture } from "../utils/fixture";
import { TestApp } from "../utils/test-app";

export class ChainedDrawFixture implements IFixture {
  constructor(public readonly entity: ChainedDraw) {}

  async load(app: TestApp): Promise<void> {
    const chainedDrawRepository = app.get<IChainedDrawRepository>(
      I_CHAINED_DRAW_REPOSITORY,
    );
    await chainedDrawRepository.create(this.entity);
  }
}
