import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  Patch,
  Get,
  Delete,
  Query,
} from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { CreateQuestionDto } from './dtos/create-question.dto';
import { UpdateQuestionDto } from './dtos/update-question.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('questions')
@ApiTags('Questions')
export class QuestionsController {
  constructor(private service: QuestionsService) {}

  @Get('/by-date')
  @UsePipes(new ValidationPipe())
  getByDate() {
    return this.service.getByDate();
  }

  @Get()
  @UsePipes(new ValidationPipe())
  getFresh(@Query() dto: { limit: string; tags: string[] }) {
    return this.service.get(dto);
  }

  @Post()
  @UsePipes(new ValidationPipe())
  create(@Body() dto: CreateQuestionDto[]) {
    return this.service.create(dto);
  }

  @Patch()
  @UsePipes(new ValidationPipe())
  update(@Body() dto: UpdateQuestionDto[]) {
    return this.service.update(dto);
  }

  @Delete('/by-date')
  deleteQuestionsByDate() {
    return this.service.deleteQuestionsByDate();
  }
}
