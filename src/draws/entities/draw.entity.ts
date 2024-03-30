import { Entity } from "../../shared/entity.abstract";

type DrawProps = {
  id: string;
  title: string;
  organizerId: string;
  year: number;
};

export class Draw extends Entity<DrawProps> {}
