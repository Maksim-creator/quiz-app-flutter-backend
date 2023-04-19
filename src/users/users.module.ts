import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './users.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { JwtModule } from '@nestjs/jwt';
import { Avatar } from '../avatars/avatars.model';
import { AvatarsService } from '../avatars/avatars.service';

@Module({
  providers: [UsersService, AvatarsService],
  controllers: [UsersController],
  imports: [
    SequelizeModule.forFeature([User]),
    SequelizeModule.forFeature([Avatar]),
    JwtModule.register({
      secret: process.env.PRIVATE_KEY || 'SECRET',
      signOptions: {
        expiresIn: '24h',
      },
    }),
  ],
  exports: [UsersService],
})
export class UsersModule {}
