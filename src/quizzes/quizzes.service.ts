import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Category } from '../category/categories.model';
import { Question, Quiz } from './quizzes.model';
import { shuffle } from 'lodash';

@Injectable()
export class QuizzesService {
  constructor(
    @InjectModel(Quiz) private quizzesRepository: typeof Quiz,
    @InjectModel(Category) private categoryRepository: typeof Category,
  ) {}

  async createQuiz(body: {
    topic: string;
    icon: string;
    category: string;
    questions: Question[];
    author: string;
  }) {
    const existedTopic = await this.quizzesRepository.findOne({
      where: { topic: body.topic },
    });
    if (existedTopic) {
      throw new HttpException(
        'This topic already exists. Try to create new one or add questions to this topic',
        HttpStatus.NOT_FOUND,
      );
    }

    return await this.quizzesRepository.create(body);
  }

  async addQuestion(body: {
    category: string;
    topic: string;
    questions: Question[];
  }) {
    const topic = await this.quizzesRepository.findOne({
      where: { category: body.category, topic: body.topic },
    });

    if (!topic) {
      throw new HttpException('Topic not found', HttpStatus.NOT_FOUND);
    }

    return await this.quizzesRepository.update(
      { questions: topic.questions.concat(body.questions) },
      { where: { category: body.category, topic: body.topic } },
    );
  }

  async topSelected() {
    const maxSelectedTimes = await Quiz.max('selectedTimes');
    const topic = await this.quizzesRepository.findOne({
      where: { selectedTimes: maxSelectedTimes },
    });
    const category = await this.categoryRepository.findOne({
      where: { category: topic.category },
    });
    return {
      id: topic.id,
      category: topic.category,
      topic: topic.topic,
      icon: topic.icon,
      quizzesCount: category.quizzesCount,
    };
  }

  async getTopics(category: string) {
    return await this.quizzesRepository.findAll({
      where: { category },
      attributes: { exclude: ['questions'] },
    });
  }

  async getQuestions(topic: string, count: number) {
    const quiz = await this.quizzesRepository.findOne({
      limit: count,
      where: { topic },
      attributes: {
        include: ['questions'],
        exclude: [
          'category',
          'topic',
          'icon',
          'selectedTimes',
          'author',
          'description',
        ],
      },
    });

    if (!quiz) {
      throw Error('no quiz from this topic');
    }

    return shuffle(quiz.questions);
  }

  async getQuizById(id: string) {
    return await this.quizzesRepository.findOne({
      where: { id: id },
      attributes: { exclude: ['questions'] },
    });
  }

  async getAllQuizzes() {
    return await this.quizzesRepository.findAll({
      attributes: { exclude: ['questions'] },
    });
  }
}
