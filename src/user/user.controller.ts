import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtService } from '@nestjs/jwt';
import { CompletedQuiz, RecentQuiz } from './user.model';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('/updateUserQuizData')
  async updateUserQuizData(
    @Req() request: any,
    @Body() body: { completedQuiz: CompletedQuiz },
  ) {
    return await this.userService.updateUserQuizData(
      request.headers.authorization,
      body.completedQuiz,
    );
  }

  @Get('/getUserQuizData')
  async getUserQuizData(@Req() request: any) {
    return await this.userService.getUserQuizData(
      request.headers.authorization,
    );
  }

  @Get('/recentQuiz')
  async getRecentQuiz(@Req() request: any) {
    return await this.userService.getRecentQuiz(request.headers.authorization);
  }

  @Post('/recentQuiz')
  async postRecentQuiz(
    @Req() request: any,
    @Body() body: { recentQuiz: RecentQuiz },
  ) {
    return await this.userService.postRecentQuiz(
      request.headers.authorization,
      body.recentQuiz,
    );
  }
}
