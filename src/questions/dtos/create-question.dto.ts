import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateQuestionDto {
  @ApiProperty({ required: true, type: String })
  @IsNotEmpty()
  @IsString()
  question: string;

  @ApiProperty({ required: true, type: [String] })
  @IsNotEmpty()
  answers: string[];

  @ApiProperty({ required: true, type: Number })
  @IsNotEmpty()
  @IsNumber()
  correctAnswerIndex: number;

  @ApiProperty({ required: false, type: String })
  @IsOptional()
  @IsString()
  @MaxLength(190)
  explanation?: string;

  @ApiProperty({ required: false, type: String })
  @IsOptional()
  @IsString()
  datePublishEveryDay?: string | Date;

  @ApiProperty({ required: false, type: Number })
  @IsOptional()
  @IsNumber()
  countPublish?: number;

  @ApiProperty({ required: false, type: Number })
  @IsOptional()
  @IsNumber()
  countTrueAnswer?: number;

  @ApiProperty({ required: false, type: [String] })
  @IsOptional()
  tags?: string[];
}
