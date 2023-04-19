import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { AvatarsService } from '../avatars/avatars.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Avatar } from '../avatars/avatars.model';

@Module({
  controllers: [AuthController],
  providers: [AuthService, AvatarsService],
  imports: [
    UsersModule,
    SequelizeModule.forFeature([Avatar]),
    JwtModule.register({
      secret: process.env.PRIVATE_KEY || 'SECRET',
      signOptions: {
        expiresIn: '24h',
      },
    }),
  ],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
