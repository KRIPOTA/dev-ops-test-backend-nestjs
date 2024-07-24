import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  Get,
  Param,
  HttpException,
  Patch,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserStatsDto } from './dtos/update-user-stats.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get('/tg/:tgId')
  async getByTgId(@Param('tgId') tgId: string) {
    const findUser = await this.usersService.getByTgId(+tgId);
    if (!findUser) throw new HttpException('User not found', 404);
    return findUser;
  }

  //STATS

  @Patch('/stats')
  @UsePipes(new ValidationPipe())
  async updateUserStats(@Body() dto: UpdateUserStatsDto) {
    return this.usersService.updateUserStats(dto);
  }
}
