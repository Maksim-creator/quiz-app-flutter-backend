import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from '../users/users.model';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcryptjs from 'bcryptjs';
import { AvatarsService } from '../avatars/avatars.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    private avatarsService: AvatarsService,
  ) {}

  async login(dto: CreateUserDto) {
    const user = await this.userService.getUserByEmail(dto.email);

    if (!user) {
      throw new HttpException('User does not exist', HttpStatus.BAD_REQUEST);
    }

    const isPasswordEqual = await bcryptjs.compare(dto.password, user.password);

    if (!isPasswordEqual) {
      throw new UnauthorizedException({ message: 'Invalid password' });
    }

    const token = await this.generateToken(user);
    const rank = await this.userService.getUserRank(user.email);
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      token,
      data: {
        level: Math.floor(user.totalExperience / 50),
        totalExperience: user.totalExperience,
        rank,
        balance: user.balance,
      },
      avatar: await this.avatarsService.getFile(user.email),
    };
  }

  async registration(dto: CreateUserDto) {
    const user = await this.userService.getUserByEmail(dto.email);

    // encode(buffer);

    if (user) {
      throw new HttpException(
        'User with this email has already registered',
        HttpStatus.BAD_REQUEST,
      );
    }
    const hashedPassword = await bcryptjs.hash(dto.password, 5);
    const newUser = await this.userService.createUser({
      ...dto,
      password: hashedPassword,
    });

    const token = await this.generateToken(newUser);
    const rank = await this.userService.getUserRank(newUser.email);

    return {
      token,
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      data: {
        level: Math.floor(newUser.totalExperience / 50),
        totalExperience: newUser.totalExperience,
        rank,
        balance: newUser.balance,
      },
      avatar: '',
    };
  }

  async generateToken(user: User) {
    const payload = {
      email: user.email,
      password: user.password,
      id: user.id,
    };
    return this.jwtService.sign(payload);
  }
}
