import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { QuestionsModule } from './questions/questions.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://mongodb/dev_ops_test'),
    UsersModule,
    QuestionsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
