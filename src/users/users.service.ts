import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dtos/create-user.dto';
import { User } from './schemas/user.schema';
import { UserStats } from './schemas/stats.schema';
import { UpdateUserStatsDto } from './dtos/update-user-stats.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(UserStats.name)
    private userStatsModel: Model<UserStats>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const newUser = new this.userModel(createUserDto);

    const savedUser = await newUser.save();
    const findUser = await this.userModel.findById(savedUser._id);

    const newUserStats = new this.userStatsModel({
      userId: createUserDto.tgId,
      user: findUser.id,
    });

    const savedUserStats = await newUserStats.save();
    await findUser.updateOne({
      $push: {
        stats: savedUserStats._id,
      },
    });

    return this.getByTgId(savedUser.tgId);
  }

  async getByTgId(tgId: number) {
    const user = await this.userModel
      .findOne({ tgId: { $eq: tgId } })
      .populate('stats');

    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    return user;
  }

  //STATS

  updateUserStats(dto: UpdateUserStatsDto) {
    return this.userStatsModel.updateOne(
      {
        userId: { $eq: dto.userId },
      },
      { $set: { ...dto } },
    );
  }
}
