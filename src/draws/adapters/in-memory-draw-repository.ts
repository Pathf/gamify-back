import { Draw } from "../entities/draw.entity";
import { IDrawRepository } from "../ports/draw-repository.interace";

export class InMemoryDrawRepository implements IDrawRepository {
  constructor(private draws: Draw[] = []) {}

  public async findById(id: string): Promise<Draw | null> {
    return this.draws.find((draw) => draw.props.id === id) || null;
  }

  public async findAll(): Promise<Draw[]> {
    return this.draws;
  }

  public async create(draw: Draw): Promise<void> {
    this.draws.push(draw);
  }

  public async delete(id: string): Promise<void> {
    this.draws = this.draws.filter((draw) => draw.props.id !== id);
  }
}
