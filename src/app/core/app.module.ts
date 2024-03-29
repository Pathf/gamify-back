import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommonModule } from './common.module';
import { AuthGuard } from './auth.guard';
import { Authenticator } from '../users/services/authenticator';
import { APP_GUARD } from '@nestjs/core';
import { I_USER_REPOSITORY } from '../users/ports/user-repository.interface';

@Module({
  imports: [
    // bddmodule ou config
    CommonModule,
    // usecase module
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: Authenticator,
      inject: [I_USER_REPOSITORY],
      useFactory: (repository) => {
        return new Authenticator(repository);
      },
    },
    {
      provide: APP_GUARD,
      inject: [Authenticator],
      useFactory(authenticator) {
        return new AuthGuard(authenticator);
      },
    },
  ],
})
export class AppModule {}
