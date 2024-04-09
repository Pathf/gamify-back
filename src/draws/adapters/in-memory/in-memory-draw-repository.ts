import { Draw } from "../../entities/draw.entity";
import { IDrawRepository } from "../../ports/draw-repository.interace";

export class InMemoryDrawRepository implements IDrawRepository {
  constructor(private draws: Draw[] = []) {}

  public async findOne(id: string): Promise<Draw | null> {
    return this.findByIdSync(id);
  }

  public async findAll(): Promise<Draw[]> {
    return this.findAllSync();
  }

  public async create(draw: Draw): Promise<void> {
    this.draws.push(draw);
  }

  public async delete(id: string): Promise<void> {
    this.draws = this.draws.filter((draw) => draw.props.id !== id);
  }

  public async deleteAll(): Promise<void> {
    this.draws.length = 0;
  }

  // Just for testing purposes
  public findAllSync(): Draw[] {
    return this.draws;
  }

  public findByIdSync(id: string): Draw | null {
    return this.draws.find((draw) => draw.props.id === id) || null;
  }
}
