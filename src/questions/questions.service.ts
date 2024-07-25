import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Question } from './schema/question.schema';
import { CreateQuestionDto } from './dtos/create-question.dto';
import { UpdateQuestionDto } from './dtos/update-question.dto';

@Injectable()
export class QuestionsService {
  constructor(
    @InjectModel(Question.name) private questionModel: Model<Question>,
  ) {}

  async getFresh() {
    // Получаем вопросы без даты публикации
    const questionsWithoutDate = await this.questionModel.find({
      datePublishEveryDay: { $eq: null },
    });

    if (questionsWithoutDate.length < 10) {
      // Получаем вопросы с датой публикации более двух месяцев назад
      const twoMonthsAgo = new Date();
      twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);
      const questionsWithOldDate = await this.questionModel.find({
        datePublishEveryDay: { $lt: twoMonthsAgo },
      });

      if (questionsWithoutDate.length + questionsWithOldDate.length < 10) {
        // Получаем случайные вопросы, исключая те, которые уже есть в предыдущих массивах
        const randomQuestions = await this.questionModel.aggregate([
          {
            $match: {
              _id: {
                $nin: questionsWithoutDate
                  .map((q) => q._id)
                  .concat(questionsWithOldDate.map((q) => q._id)),
              },
            },
          },
          {
            $sample: {
              size:
                10 - questionsWithoutDate.length - questionsWithOldDate.length,
            },
          },
        ]);

        // Возвращаем все вопросы
        return questionsWithoutDate
          .concat(questionsWithOldDate)
          .concat(randomQuestions);
      } else {
        return questionsWithoutDate.concat(questionsWithOldDate);
      }
    } else {
      return questionsWithoutDate;
    }
  }

  async create(dto: CreateQuestionDto[]) {
    return new this.questionModel({ ...dto }).save();
  }

  async update(dto: UpdateQuestionDto[]) {
    await Promise.all(
      dto.map(async (question) => {
        return await this.questionModel.findByIdAndUpdate(
          question._id,
          question,
          { new: true },
        );
      }),
    );
  }
}
