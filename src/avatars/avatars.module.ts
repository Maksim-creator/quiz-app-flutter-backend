import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AvatarsController } from './avatars.controller';
import { AvatarsService } from './avatars.service';
import { Avatar } from './avatars.model';
import { UsersService } from '../users/users.service';
import { User } from '../users/users.model';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [AvatarsController],
  providers: [AvatarsService, UsersService],
  imports: [
    SequelizeModule.forFeature([Avatar]),
    SequelizeModule.forFeature([User]),
    JwtModule.register({
      secret: process.env.PRIVATE_KEY || 'SECRET',
      signOptions: {
        expiresIn: '24h',
      },
    }),
  ],
  exports: [AvatarsService],
})
export class AvatarsModule {}
