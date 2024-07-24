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
    const twoMonthsAgo = new Date();
    twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);

    const questions = await this.questionModel
      .find({ datePublish: { $lt: twoMonthsAgo } })
      .limit(10)
      .sort({ datePublish: -1 });

    if (questions.length < 10) {
      const randomQuestions = await this.questionModel.aggregate([
        { $sample: { size: 10 } },
      ]);
      return [...questions, ...randomQuestions];
    }

    return questions;
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
