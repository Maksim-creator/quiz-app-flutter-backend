import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Avatar } from './avatars.model';
import * as fs from 'fs';
import { encode } from 'base64-arraybuffer';

@Injectable()
export class AvatarsService {
  constructor(@InjectModel(Avatar) private avatarRepository: typeof Avatar) {}

  async postUserAvatar(avatar: Express.Multer.File, email: string) {
    const { path, filename } = avatar;
    const userAvatar = await this.avatarRepository.findOne({
      where: { email },
    });
    if (userAvatar) {
      fs.unlink(userAvatar.path, (err) => {
        if (err) {
          console.log(err);
          return 'Error';
        }
        console.log('suc');
        return 'Success';
      });
      return await this.avatarRepository.update(
        { path, filename },
        { where: { email } },
      );
    }
    return await this.avatarRepository.create({ email, path, filename });
  }

  async getUserAvatar(email: string) {
    return await this.avatarRepository.findOne({
      where: { email },
    });
  }

  async getFile(email: string) {
    const avatar = await this.getUserAvatar(email);
    if (!avatar) {
      throw new HttpException(
        'Can not find user avatar',
        HttpStatus.BAD_REQUEST,
      );
    }

    const buffer = fs.readFileSync(
      process.cwd() + '/uploadedFiles/avatars/' + avatar.filename,
    ).buffer;
    return encode(buffer);
  }
}
