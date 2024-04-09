import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class PostgresChainedDraw {
  @PrimaryColumn()
  drawId: string;

  @PrimaryColumn()
  donorId: string;

  @Column({
    nullable: false,
  })
  receiverId: string;

  @Column({
    nullable: false,
  })
  dateDraw: Date;
}
