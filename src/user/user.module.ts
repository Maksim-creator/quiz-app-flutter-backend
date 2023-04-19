import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Quiz } from '../quizzes/quizzes.model';
import { UserController } from './user.controller';
import { UserData } from './user.model';
import { UserService } from './user.service';
import { JwtModule } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { User } from '../users/users.model';
import { Avatar } from '../avatars/avatars.model';
import { AvatarsService } from '../avatars/avatars.service';

@Module({
  controllers: [UserController],
  providers: [UserService, UsersService, AvatarsService],
  imports: [
    SequelizeModule.forFeature([UserData]),
    SequelizeModule.forFeature([Quiz]),
    SequelizeModule.forFeature([User]),
    SequelizeModule.forFeature([Avatar]),
    JwtModule.register({
      secret: process.env.PRIVATE_KEY || 'SECRET',
      signOptions: {
        expiresIn: '24h',
      },
    }),
  ],
  exports: [UserService],
})
export class UserModule {}
