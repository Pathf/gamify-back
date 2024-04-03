import { ChainedDraw } from "../entities/chained-draw.entity";
import { IChainedDrawRepository } from "../ports/chained-draw-repository.interface";

export class InMemoryChainedDrawRepository implements IChainedDrawRepository {
  constructor(private chainedDraws: ChainedDraw[] = []) {}

  async findByDrawId(drawId: string): Promise<ChainedDraw[]> {
    return this.findByDrawIdSync(drawId);
  }

  async create(chainedDraw: ChainedDraw): Promise<void> {
    this.chainedDraws.push(chainedDraw);
  }

  // Just for testing purposes
  findByDrawIdSync(drawId: string): ChainedDraw[] {
    return this.chainedDraws.filter(
      (chainedDraw) => chainedDraw.props.drawId === drawId,
    );
  }
}
