import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { User } from '../users/users.model';
import { Friend } from './friends.model';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class FriendsService {
  constructor(
    @InjectModel(User) private usersRepository: typeof User,
    @InjectModel(Friend) private friendsRepository: typeof Friend,
    private jwtService: JwtService,
  ) {}

  async sendRequest(friendId: number, userId: number) {
    const friend = await this.friendsRepository.findOne({
      where: { userId: friendId },
    });
    const user = await this.friendsRepository.findOne({
      where: { userId: userId },
    });

    await this.friendsRepository.update(
      { requestGot: [...friend.requestGot, userId] },
      { where: { userId: friend.userId } },
    );
    await this.friendsRepository.update(
      { requestSent: [...user.requestSent, friendId] },
      { where: { userId: userId } },
    );
  }

  async submitRequest(token: string, whoSent: number) {
    const whoGetData = await this.jwtService.verify(token);
    const userWhoGetRequest = await this.friendsRepository.findOne({
      where: { userId: whoGetData.id },
    });
    const userWhoSentRequest = await this.friendsRepository.findOne({
      where: { userId: whoSent },
    });

    await this.friendsRepository.update(
      {
        requestSent: userWhoSentRequest.requestSent.filter(
          (request) => request != whoGetData.id,
        ),
        friends: [...userWhoSentRequest.friends, whoGetData.id],
      },
      { where: { userId: whoSent } },
    );

    await this.friendsRepository.update(
      {
        requestGot: userWhoGetRequest.requestGot.filter(
          (request) => request != whoSent,
        ),
        friends: [...userWhoGetRequest.friends, whoSent],
      },
      { where: { userId: whoGetData.id } },
    );

    return userWhoGetRequest.requestGot.filter((request) => request != whoSent);
  }

  async rejectRequest(token: string, whoSent: number) {
    const whoGetData = await this.jwtService.verify(token);
    const userWhoGetRequest = await this.friendsRepository.findOne({
      where: { userId: whoGetData.id },
    });
    const userWhoSentRequest = await this.friendsRepository.findOne({
      where: { userId: whoSent },
    });

    await this.friendsRepository.update(
      {
        requestSent: userWhoSentRequest.requestSent.filter(
          (request) => request != whoGetData.id,
        ),
      },
      { where: { userId: whoSent } },
    );

    await this.friendsRepository.update(
      {
        requestGot: userWhoGetRequest.requestGot.filter(
          (request) => request != whoSent,
        ),
      },
      { where: { userId: whoGetData.id } },
    );

    return userWhoGetRequest.requestGot.filter((request) => request != whoSent);
  }

  async getAllFriends(token: string) {
    const data = await this.jwtService.verify(token);

    const user = await this.friendsRepository.findOne({
      where: { userId: data.id },
    });
    return user.friends;
  }

  async getIncomingRequests(token: string) {
    const data = await this.jwtService.verify(token);

    const user = await this.friendsRepository.findOne({
      where: { userId: data.id },
    });

    return user.requestGot;
  }
}
