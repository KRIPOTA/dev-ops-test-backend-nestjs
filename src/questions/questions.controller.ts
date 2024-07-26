import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  Patch,
  Get,
} from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { CreateQuestionDto } from './dtos/create-question.dto';
import { UpdateQuestionDto } from './dtos/update-question.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('questions')
@ApiTags('Questions')
export class QuestionsController {
  constructor(private questions: QuestionsService) {}

  @Get()
  @UsePipes(new ValidationPipe())
  getFresh() {
    return this.questions.get();
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
}
