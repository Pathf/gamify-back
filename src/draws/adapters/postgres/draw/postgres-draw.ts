import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class PostgresDraw {
  @PrimaryColumn({
    nullable: false,
  })
  id: string;

  @Column({
    nullable: false,
  })
  title: string;

  @Column({
    nullable: false,
  })
  organizerId: string;

  @Column({
    nullable: false,
  })
  year: number;

  @Column({
    nullable: false,
  })
  isFinish: boolean;
}
