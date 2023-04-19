import { Body, Controller, Post, Request } from '@nestjs/common';
import { FriendsService } from './friends.service';

@Controller('friends')
export class FriendsController {
  constructor(private friendsService: FriendsService) {}

  @Post('/sendRequest')
  async sendFriendRequest(@Body() body: { friendId: number; userId: number }) {
    return await this.friendsService.sendRequest(body.friendId, body.userId);
  }

  @Post('/submitRequest')
  async submitFriendRequest(
    @Body() body: { whoSent: number },
    @Request() req: any,
  ) {
    return await this.friendsService.submitRequest(
      req.headers.authorization,
      body.whoSent,
    );
  }

  @Post('/rejectRequest')
  async rejectFriendRequest(
    @Body() body: { whoSent: number },
    @Request() req: any,
  ) {
    return await this.friendsService.rejectRequest(
      req.headers.authorization,
      body.whoSent,
    );
  }

  @Post()
  async getFriends(@Request() req: any) {
    return await this.friendsService.getAllFriends(req.headers.authorization);
  }

  @Post('/getIncomingRequests')
  async getIncomingRequests(@Request() req: any) {
    return await this.friendsService.getIncomingRequests(
      req.headers.authorization,
    );
  }
}
