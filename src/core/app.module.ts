import { Module } from "@nestjs/common";

import { AuthModule } from "../auth/auth.module";
import { DrawsModule } from "../draws/draws.module";
import { UsersModule } from "../users/users.module";
import { AppController } from "./app.controller";

import { TypeOrmModule } from "@nestjs/typeorm";
import { PostgresChainedDraw } from "../draws/adapters/postgres/chained-draw/postgres-chained-draw";
import { PostgresCondition } from "../draws/adapters/postgres/condition/postgres-condition";
import { PostgresDraw } from "../draws/adapters/postgres/draw/postgres-draw";
import { PostgresParticipation } from "../draws/adapters/postgres/participation/postgres-participation";
import { PostgresUser } from "../users/adapters/postgres/postgres-user";
import { CommonModule } from "./common.module";

export const postgreEntities = [
  PostgresUser,
  PostgresDraw,
  PostgresParticipation,
  PostgresCondition,
  PostgresChainedDraw,
];

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "postgres",
      host: process.env.DB_HOST,
      port: +(process.env.DB_PORT ?? 5342),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: postgreEntities,
      synchronize: true,
    }),
    CommonModule,
    AuthModule,
    UsersModule,
    DrawsModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
