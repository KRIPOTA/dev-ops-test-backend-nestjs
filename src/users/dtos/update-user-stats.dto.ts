import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateUserStatsDto {
  @ApiProperty({ required: true, type: Number })
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @ApiProperty({ required: false, type: Number })
  @IsOptional()
  @IsNumber()
  questionsAnswer?: number;

  @ApiProperty({ required: false, type: Number })
  @IsOptional()
  @IsNumber()
  questionsAnswerTrue?: number;

  @ApiProperty({ required: false, type: Number })
  @IsOptional()
  @IsNumber()
  loginCountDays?: number;

  @ApiProperty({ required: false, type: String })
  @IsOptional()
  @IsString()
  loginLast?: string;
}
