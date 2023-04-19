import { Body, Controller, Get, Post } from '@nestjs/common';
import { QuizzesService } from './quizzes.service';
import { Question, QuizzesCreationAttr } from './quizzes.model';
import { v4 as uuidv4 } from 'uuid';
import { CategoriesService } from '../category/categories.service';

@Controller('quizzes')
export class QuizzesController {
  constructor(
    private quizzesService: QuizzesService,
    private categoriesService: CategoriesService,
  ) {}
  @Post()
  async createQuiz(
    @Body()
    body: {
      topic: string;
      icon: string;
      category: string;
      questions: Question[];
      author: string;
    },
  ) {
    const newQuiz: QuizzesCreationAttr = {
      id: uuidv4(),
      selectedTimes: 0,
      ...body,
    };
    await this.categoriesService.updateQuizzesCount(body.category);
    return await this.quizzesService.createQuiz(newQuiz);
  }

  @Post('/addQuestion')
  async addQuestionToCategory(
    @Body() body: { category: string; topic: string; questions: Question[] },
  ) {
    return await this.quizzesService.addQuestion(body);
  }

  @Get('/topSelected')
  async getTopSelected() {
    return await this.quizzesService.topSelected();
  }

  @Post('/topics')
  async getTopicsByCategory(@Body() body: { category: string }) {
    return await this.quizzesService.getTopics(body.category);
  }

  @Post('/quiz')
  async getQuizQuestionsByTopic(
    @Body() body: { topic: string; count: number },
  ) {
    return await this.quizzesService.getQuestions(body.topic, body.count);
  }

  @Post('/quizById')
  async getQuizById(@Body() body: { id: string }) {
    return await this.quizzesService.getQuizById(body.id);
  }

  @Get('/getAllTopics')
  async getAllQuizzes() {
    return await this.quizzesService.getAllQuizzes();
  }
}
