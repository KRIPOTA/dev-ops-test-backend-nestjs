import { IsNotEmpty, IsString } from 'class-validator';
import { CreateQuestionDto } from './create-question.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateQuestionDto extends CreateQuestionDto {
  @ApiProperty({ required: true, type: String })
  @IsNotEmpty()
  @IsString()
  id: string;
}
