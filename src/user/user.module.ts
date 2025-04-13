import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TokenController } from './token.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController, TokenController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
