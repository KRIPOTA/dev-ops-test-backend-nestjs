import { Controller, UsePipes, ValidationPipe, Get } from '@nestjs/common';
import { ThemesService } from './themes.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('themes')
@ApiTags('Themes')
export class ThemesController {
  constructor(private service: ThemesService) {}

  @Get()
  @UsePipes(new ValidationPipe())
  get() {
    return this.service.get();
  }
}
