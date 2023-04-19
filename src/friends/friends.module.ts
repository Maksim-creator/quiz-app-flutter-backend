import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { FriendsService } from './friends.service';
import { FriendsController } from './friends.contoller';
import { User } from '../users/users.model';
import { Friend } from './friends.model';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [FriendsController],
  providers: [FriendsService],
  imports: [
    SequelizeModule.forFeature([User]),
    SequelizeModule.forFeature([Friend]),
    JwtModule.register({
      secret: process.env.PRIVATE_KEY || 'SECRET',
      signOptions: {
        expiresIn: '24h',
      },
    }),
  ],
  exports: [FriendsService],
})
export class FriendsModule {}
