import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CompletedQuiz, RecentQuiz, UserData } from './user.model';
import { JwtService } from '@nestjs/jwt';
import { Quiz } from '../quizzes/quizzes.model';
import { UsersService } from '../users/users.service';
import {
  getAverageCompletion,
  getChartData,
  getFavoriteTopic,
  getQuizWon,
  getTotalPlayedQuizzes,
} from './utils';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(UserData) private userDataRepository: typeof UserData,
    private jwtService: JwtService,

    @InjectModel(Quiz) private quizzesRepository: typeof Quiz,
    private usersService: UsersService,
  ) {}

  async updateUserQuizData(token: string, body: CompletedQuiz) {
    const { email } = await this.jwtService.verify(token);
    const user = await this.userDataRepository.findOne({ where: { email } });

    if (!user) {
      return await this.userDataRepository.create({
        email: email,
        completedQuizzes: [body],
      });
    } else {
      return await this.userDataRepository.update(
        { completedQuizzes: [...user.completedQuizzes, body] },
        { where: { email } },
      );
    }
  }

  async getUserQuizData(token: string) {
    const { email } = await this.jwtService.verify(token);
    const currentUser = await this.usersService.getUserByEmail(email);

    const user = await this.userDataRepository.findOne({
      where: { email: email },
    });

    const createdByUser = await this.quizzesRepository.findAll({
      where: { author: currentUser.name },
      attributes: {
        exclude: ['questions'],
      },
    });

    const totalQuizzes = await this.quizzesRepository.findAll({
      attributes: { exclude: ['questions'] },
    });

    if (!user) {
      await this.userDataRepository.create({
        completedQuizzes: [],
        email: email,
      });

      return {
        createdQuizzes: createdByUser.length,
        totalQuizzes: totalQuizzes.length,
        favoriteTopic: '',
        averageCompletion: 0,
        quizzesWon: 0,
        totalPlayedQuizzes: 0,
        chartData: [],
      };
    }

    return {
      createdQuizzes: createdByUser.length,
      totalQuizzes: totalQuizzes.length,
      favoriteTopic: getFavoriteTopic(user.completedQuizzes),
      averageCompletion: getAverageCompletion(user.completedQuizzes),
      quizzesWon: getQuizWon(user.completedQuizzes),
      totalPlayedQuizzes: getTotalPlayedQuizzes(user.completedQuizzes),
      chartData: getChartData(user.completedQuizzes),
    };
  }

  async getRecentQuiz(token: string) {
    const { email } = await this.jwtService.verify(token);
    const userData = await this.userDataRepository.findOne({
      attributes: {
        include: ['recentQuiz'],
        exclude: ['completedQuizzes', 'email'],
      },
      where: {
        email: email,
      },
    });

    return userData.recentQuiz;
  }

  async postRecentQuiz(token: string, recentQuiz: RecentQuiz) {
    const { email } = await this.jwtService.verify(token);
    await this.userDataRepository.update(
      { recentQuiz: recentQuiz },
      { where: { email: email } },
    );

    return recentQuiz;
  }
}
