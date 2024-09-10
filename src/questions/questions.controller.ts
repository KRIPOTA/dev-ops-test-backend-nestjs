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
  constructor(private questions: QuestionsService) {}

  @Get('/by-date')
  @UsePipes(new ValidationPipe())
  getByDate() {
    return this.questions.getByDate();
  }

  @Get()
  @UsePipes(new ValidationPipe())
  getFresh(@Query('limit') limit: string) {
    return this.questions.get(+limit);
  }

  @Post()
  @UsePipes(new ValidationPipe())
  create(@Body() dto: CreateQuestionDto[]) {
    return this.questions.create(dto);
  }

  @Patch()
  @UsePipes(new ValidationPipe())
  update(@Body() dto: UpdateQuestionDto[]) {
    return this.questions.update(dto);
  }

  @Delete('/by-date')
  deleteQuestionsByDate() {
    return this.questions.deleteQuestionsByDate();
  }
}
