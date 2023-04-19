import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { User } from './users/users.model';
import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';
import { BadgesModule } from './badges/badges.module';
import { Badge } from './badges/badges.model';
import { AvatarsModule } from './avatars/avatars.module';
import { CategoriesModule } from './category/categories.module';
import { QuizzesModule } from './quizzes/quizzes.module';
import { UserModule } from './user/user.module';
import { FriendsModule } from './friends/friends.module';

@Module({
  controllers: [],
  providers: [AuthService],
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: +process.env.POSTGRES_PORT,
      username: process.env.POSTGRES_USERNAME,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      models: [User, Badge],
      autoLoadModels: true,
    }),
    UsersModule,
    AuthModule,
    BadgesModule,
    AvatarsModule,
    CategoriesModule,
    QuizzesModule,
    UserModule,
    FriendsModule,
  ],
})
export class AppModule {}
