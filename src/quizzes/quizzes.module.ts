import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { QuizzesController } from './quizzes.controller';
import { QuizzesService } from './quizzes.service';
import { Quiz } from './quizzes.model';
import { CategoriesService } from '../category/categories.service';
import { Category } from '../category/categories.model';

@Module({
  controllers: [QuizzesController],
  providers: [QuizzesService, CategoriesService],
  imports: [
    SequelizeModule.forFeature([Quiz]),
    SequelizeModule.forFeature([Category]),
  ],
  exports: [QuizzesService],
})
export class QuizzesModule {}
