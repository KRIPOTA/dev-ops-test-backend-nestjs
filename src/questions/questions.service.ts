import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Question } from './schemas/question.schema';
import { CreateQuestionDto } from './dtos/create-question.dto';
import { UpdateQuestionDto } from './dtos/update-question.dto';
import { QuestionsByDate } from './schemas/questions-by-date.schema';
@Injectable()
export class QuestionsService {
  constructor(
    @InjectModel(Question.name) private questionModel: Model<Question>,
    @InjectModel(QuestionsByDate.name)
    private questionsByDateModel: Model<QuestionsByDate>,
  ) {}

  async get() {
    const date = new Date();
    date.setHours(0, 0, 0, 0);

    const questionsIds = await this.getQuestionsIdsByDate(date);

    return this.questionModel.find({ _id: { $in: questionsIds } });
  }

  async getQuestionsIdsByDate(date: Date) {
    let questionsIdsByDate = await this.questionsByDateModel.findOne({
      date: { $eq: date },
    });

    if (!questionsIdsByDate) {
      await this.setQuestionsIdsByDate(date);

      questionsIdsByDate = await this.questionsByDateModel.findOne({
        date: { $eq: date },
      });
    }

    return questionsIdsByDate.questionsIds;
  }

  async setQuestionsIdsByDate(date: Date) {
    const freshQuestions = await this.getFresh();
    const freshQuestionsIds = freshQuestions.map((q) => q._id);

    const questionsIdsByDate = {
      date,
      questionsIds: freshQuestionsIds,
    };
    await new this.questionsByDateModel(questionsIdsByDate).save();
    const updatedFreshQuestions = [];
    for (const question of freshQuestions) {
      const initialArray = question.answers;
      const initialCorrectIndex = question.correctAnswerIndex;

      const { shuffledArr, newIndex } = this.shuffleArrayAndUpdateIndex(
        initialArray,
        initialCorrectIndex,
      );

      question.answers = shuffledArr;
      question.correctAnswerIndex = newIndex;
      updatedFreshQuestions.push(question);
    }
    await this.update(updatedFreshQuestions);
  }

  private shuffleArrayAndUpdateIndex(arr: string[], correctIndex: number) {
    // Create a copy of the original array to avoid modifying it
    const shuffledArr = [...arr];

    // Fisher-Yates shuffle algorithm to shuffle the array
    for (let i = shuffledArr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArr[i], shuffledArr[j]] = [shuffledArr[j], shuffledArr[i]];
    }

    // Update the correct index
    const newIndex = shuffledArr.indexOf(arr[correctIndex]);

    return { shuffledArr, newIndex };
  }

  async deleteQuestionsByDate() {
    const date = new Date();
    date.setHours(0, 0, 0, 0);

    await this.questionsByDateModel.deleteOne({ date: { $eq: date } });
  }

  async getFresh(questionLength = 20) {
    // Получаем вопросы без даты публикации
    let questions =
      (await this.questionModel.find({
        datePublishEveryDay: { $eq: null },
      })) || [];

    if (questions.length < questionLength) {
      // Получаем вопросы с датой публикации более двух месяцев назад
      const twoMonthsAgo = new Date();
      twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);
      const questionsWithOldDate = await this.questionModel.find({
        datePublishEveryDay: { $lt: twoMonthsAgo },
      });

      questions = questions.concat(questionsWithOldDate);

      if (questions.length < questionLength) {
        // Получаем случайные вопросы, исключая те, которые уже есть в предыдущих массивах
        const randomQuestions = await this.questionModel.aggregate([
          {
            $match: {
              _id: {
                $nin: questions.map((q) => q._id),
              },
            },
          },
          {
            $sample: {
              size: questionLength - questions.length,
            },
          },
        ]);

        questions = questions.concat(randomQuestions);
      }
    }
    return questions.slice(0, questionLength);
  }

  async create(dto: CreateQuestionDto[]) {
    return new this.questionModel({ ...dto }).save();
  }

  async update(dto: UpdateQuestionDto[]) {
    await Promise.all(
      dto.map(async (question) => {
        return await this.questionModel.findByIdAndUpdate(
          question.id,
          question,
        );
      }),
    );
  }
}
