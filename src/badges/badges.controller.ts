import { Body, Controller, Get, Post, Request } from '@nestjs/common';
import { BadgesService } from './badges.service';
import { CreateBadgeDto } from './dto/create-badge.dto';

@Controller('badges')
export class BadgesController {
  constructor(private badgesService: BadgesService) {}

  @Get()
  async getBadges(@Request() req: any) {
    return await this.badgesService.getUserBadges(req.headers.authorization);
  }

  @Post()
  async postBadges(@Body() badges: CreateBadgeDto[]) {
    return await this.badgesService.postNewBadges(badges);
  }
}
