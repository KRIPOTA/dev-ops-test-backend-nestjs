import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  Get,
  Param,
  Patch,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserStatsDto } from './dtos/update-user-stats.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(private service: UsersService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  create(@Body() createUserDto: CreateUserDto) {
    return this.service.create(createUserDto);
  }

  @Get('/tg/:tgId')
  async getByTgId(@Param('tgId') tgId: string) {
    return this.service.getByTgId(+tgId);
  }

  //STATS

  @Patch('/stats')
  @UsePipes(new ValidationPipe())
  async updateUserStats(@Body() dto: UpdateUserStatsDto) {
    return this.service.updateUserStats(dto);
  }
}
