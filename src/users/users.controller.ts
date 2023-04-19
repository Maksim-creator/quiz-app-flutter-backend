import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Query,
  Req,
  Request,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from './users.model';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { AvatarsService } from '../avatars/avatars.service';
import { JwtService } from '@nestjs/jwt';
import * as fs from 'fs';
import { encode } from 'base64-arraybuffer';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private avatarService: AvatarsService,
    private jwtService: JwtService,
  ) {}

  @ApiOperation({ summary: 'User creation' })
  @ApiResponse({ type: User, status: 200 })
  @Post()
  create(@Body() userDto: CreateUserDto) {
    return this.usersService.createUser(userDto);
  }

  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ type: [User], status: 200 })
  @Get()
  getAll() {
    return this.usersService.getAllUsers();
  }

  @ApiOperation({ summary: 'User data update' })
  @ApiResponse({ type: User, status: 200 })
  @Put('/updatePoints')
  async putExperience(
    @Body() { points }: { points: number },
    @Request() req: any,
  ) {
    return this.usersService.putUserExperience(
      req.headers.authorization,
      +points,
    );
  }

  @Post('/user')
  async getUser(@Body() { email }: { email: string }) {
    return this.usersService.getUserData(email);
  }

  @Post('/userById')
  async getUserById(@Req() request: any, @Body() body) {
    return await this.usersService.getUserById(body.id);
  }

  @Get('/userBadges')
  async getBadges(@Request() req: any) {
    return this.usersService.getUserBadges(req.headers.authorization);
  }

  @Get('/leaderboard')
  async getLeaderboard() {
    return await this.usersService.getUsersLeaderboard();
  }

  @Post('/upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploadedFiles/avatars',
      }),
    }),
  )
  async uploadFile(
    @Req() request: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const { email } = await this.jwtService.verify(
      request.headers.authorization,
    );
    await this.avatarService.postUserAvatar(file, email);
    const avatar = await this.avatarService.getUserAvatar(email);
    const buffer = fs.readFileSync(
      process.cwd() + '/uploadedFiles/avatars/' + avatar.filename,
    ).buffer;
    return JSON.stringify({ data: encode(buffer) });
  }

  @Get('/leader')
  async getUserLeader() {
    return await this.usersService.getUserLeader();
  }

  @Post('/updateUsername')
  async updateUsername(
    @Req() request: any,
    @Body() body: { username: string },
  ) {
    return await this.usersService.updateUserAvatar(
      request.headers.authorization,
      body.username,
    );
  }

  @Post('/checkIsPasswordValid')
  async checkIsPasswordValid(
    @Req() request: any,
    @Body() body: { password: string },
  ) {
    return await this.usersService.isUserPasswordValid(
      request.headers.authorization,
      body.password,
    );
  }

  @Get('/search')
  async findUsersByQuery(@Query() query) {
    return await this.usersService.findUsersByName(query.q);
  }
}
