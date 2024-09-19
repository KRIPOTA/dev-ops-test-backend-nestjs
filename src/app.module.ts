import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { QuestionsModule } from './questions/questions.module';
import { MONGO_URI } from './constants';
import { ThemesModule } from './themes/themes.module';

@Module({
  imports: [
    MongooseModule.forRoot(MONGO_URI),
    UsersModule,
    QuestionsModule,
    ThemesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
