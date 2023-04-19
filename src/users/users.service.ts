import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './users.model';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import { Avatar } from '../avatars/avatars.model';
import { AvatarsService } from '../avatars/avatars.service';
import * as fs from 'fs';
import { encode } from 'base64-arraybuffer';
import * as bcryptjs from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User) private usersRepository: typeof User,
    @InjectModel(Avatar) private avatarsRepository: typeof Avatar,

    private jwtService: JwtService,
    private avatarService: AvatarsService,
  ) {}

  async createUser(dto: CreateUserDto) {
    const withData = {
      level: 1,
      totalExperience: 0,
      rank: 1,
      balance: 1000,
      ...dto,
    };

    return await this.usersRepository.create(withData);
  }

  async getAllUsers() {
    return await this.usersRepository.findAll();
  }

  async getUserByEmail(email: string) {
    return await this.usersRepository.findOne({
      where: { email },
      include: { all: true },
    });
  }

  async putUserExperience(token: string, points: number) {
    const data = await this.jwtService.verify(token);
    if (!data) {
      throw new UnauthorizedException();
    }

    const user = await this.getUserByEmail(data.email);
    await this.usersRepository.update(
      {
        totalExperience: user.totalExperience + points,
      },
      { where: { email: data.email } },
    );
    return await this.getUserData(data.email);
  }

  async getUserData(email: string) {
    const user = await this.getUserByEmail(email);

    return {
      data: {
        level: Math.floor(user.totalExperience / 50),
        balance: user.balance,
        totalExperience: user.totalExperience,
        rank: user.rank,
      },
    };
  }

  async getUserRank(email: string) {
    const users = await this.getAllUsers();

    const sorted = users.sort((p, n) => n.totalExperience - p.totalExperience);

    return sorted.findIndex((user) => user.email === email) + 1;
  }

  async getUserBadges(token: string) {
    const data = await this.jwtService.verify(token);
    if (!data) {
      throw new UnauthorizedException();
    }
    const user = await this.getUserByEmail(data.email);
  }

  async getUsersLeaderboard() {
    const users = await this.getAllUsers();

    return await Promise.all(
      users
        .sort((f, s) => s.totalExperience - f.totalExperience)
        .map(async (user) => {
          const avatar = await this.avatarsRepository.findOne({
            where: { email: user.email },
          });

          if (!avatar) {
            console.log('no avatar');
            return null;
          }

          const buffer = fs.readFileSync(
            process.cwd() + '/uploadedFiles/avatars/' + avatar.filename,
          ).buffer;

          const stringAvatar = JSON.stringify({ data: encode(buffer) });
          return {
            name: user.name,
            totalExperience: user.totalExperience,
            avatar: stringAvatar,
          };
        })
        .slice(0, 10),
    );
  }

  async getUserLeader() {
    const maxExp = await this.usersRepository.max('totalExperience');

    const user = await this.usersRepository.findOne({
      where: { totalExperience: maxExp },
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    const a = {
      avatar: await this.avatarService.getFile(user.email),
      name: user.name,
      totalExperience: user.totalExperience,
    };

    return a;
  }

  async getUser(username: string) {
    const user = await this.usersRepository.findOne({
      where: { name: username },
    });

    return user;
  }

  async updateUserAvatar(token: string, newName: string) {
    const user = await this.jwtService.verify(token);

    if (!user) {
      throw new UnauthorizedException();
    }

    await this.usersRepository.update(
      { name: newName },
      { where: { email: user.email } },
    );

    return { username: newName };
  }

  async isUserPasswordValid(token: string, password: string) {
    const userData = await this.jwtService.verify(token);
    if (!userData) {
      throw new UnauthorizedException();
    }
    const user = await this.usersRepository.findOne({
      where: { email: userData.email },
    });

    if (!user) {
      throw new HttpException('User does not exist', HttpStatus.BAD_REQUEST);
    }

    return await bcryptjs.compare(password, user.password);
  }

  async findUsersByName(query: string) {
    const users = await this.usersRepository.findAll();

    return query
      ? await Promise.all(
          users
            .filter((user) => user.name.toLowerCase().includes(query))
            .map(async (u) => ({
              id: u.id,
              name: u.name,
              totalExperience: u.totalExperience,
              avatar: await this.avatarService.getFile(u.email),
            })),
        )
      : [];
  }

  async getUserById(id: number) {
    const user = await this.usersRepository.findOne({
      where: { id: id },
    });

    return {
      id: user.id,
      name: user.name,
      totalExperience: user.totalExperience,
      avatar: await this.avatarService.getFile(user.email),
    };
  }
}
