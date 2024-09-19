import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Theme, ThemeSchema } from './schemas/theme.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Theme.name,
        schema: ThemeSchema,
      },
    ]),
  ],
  controllers: [],
  providers: [],
})
export class ThemesModule {}
