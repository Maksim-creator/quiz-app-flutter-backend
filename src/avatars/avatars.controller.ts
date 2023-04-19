import { Body, Controller, Post } from '@nestjs/common';
import { AvatarsService } from './avatars.service';
import { UsersService } from '../users/users.service';

@Controller('avatar')
export class AvatarsController {
  constructor(
    private avatarService: AvatarsService,
    private userService: UsersService,
  ) {}

  @Post()
  async getUserAvatarByUsername(@Body() body: { username: string }) {
    const user = await this.userService.getUser(body.username);

    return await this.avatarService.getUserAvatar(user.name);
  }
}
