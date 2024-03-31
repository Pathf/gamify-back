import { Draw } from "../entities/draw.entity";

export const I_DRAW_REPOSITORY = "I_DRAW_REPOSITORY";

export interface IDrawRepository {
  findById(id: string): Promise<Draw | null>;
  findAll(): Promise<Draw[]>;

  create(draw: Draw): Promise<void>;

  delete(id: string): Promise<void>;
}
