import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ required: true, type: Number })
  @IsNotEmpty()
  @IsNumber()
  tgId: number;

  @ApiProperty({ required: false, type: Boolean, default: false })
  @IsOptional()
  @IsBoolean()
  isBot?: boolean;

  @ApiProperty({ required: false, type: String })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiProperty({ required: false, type: String })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty({ required: false, type: String })
  @IsOptional()
  @IsString()
  username?: string;

  @ApiProperty({ required: false, type: String })
  @IsOptional()
  @IsString()
  photoUrl?: string;
}
