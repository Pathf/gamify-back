import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class PostgresCondition {
  @PrimaryColumn()
  id: string;

  @Column({
    nullable: false,
  })
  drawId: string;

  @Column({
    nullable: false,
  })
  donorId: string;

  @Column({
    nullable: false,
  })
  receiverId: string;

  @Column({
    nullable: false,
  })
  isViceVersa: boolean;
}
