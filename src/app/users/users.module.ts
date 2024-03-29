import { Module } from '@nestjs/common';
import { CommonModule } from '../core/common.module';
import { I_USER_REPOSITORY } from './ports/user-repository.interface';
import { InMemoryUserRepository } from './adapters/in-memory-user-repository';

@Module({
  imports: [CommonModule],
  controllers: [],
  providers: [
    {
      provide: I_USER_REPOSITORY,
      useFactory: () => {
        return new InMemoryUserRepository();
      }, 
    },
  ],
  exports: [I_USER_REPOSITORY],
})
export class UsersModule {}
