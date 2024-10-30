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

  async getByDate() {
    const date = new Date();
    date.setHours(0, 0, 0, 0);

    const questionsIds = await this.getQuestionsIdsByDate(date);
    const questions = await this.questionModel.find({
      _id: { $in: questionsIds },
    });

    const shuffledQuestions = this.shuffleArray([...questions]);
    return shuffledQuestions;
  }

  async get(dto: { limit: string; tags: string[] }) {
    const questions = await this.getFresh(+dto.limit, dto.tags);
    const shuffledQuestions = this.shuffleArray([...questions]);
    const updatedQuestions =
      this.updateQuestionsCurrentAnswerIndex(shuffledQuestions);
    return updatedQuestions;
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
    const freshQuestions = await this.getFresh(20, []);
    const freshQuestionsIds = freshQuestions.map((q) => q._id);

    const questionsIdsByDate = {
      date,
      questionsIds: freshQuestionsIds,
    };
    await new this.questionsByDateModel(questionsIdsByDate).save();
    const updatedFreshQuestions =
      this.updateQuestionsCurrentAnswerIndex(freshQuestions);
    await this.update(updatedFreshQuestions);
  }

  private updateQuestionsCurrentAnswerIndex(questions: Question[]) {
    const updatedQuestions = [];
    for (const question of questions) {
      const initialArray = question.answers;
      const initialCorrectIndex = question.correctAnswerIndex;

      const { shuffledArr, newIndex } = this.shuffleArrayAndUpdateIndex(
        initialArray,
        initialCorrectIndex,
      );

      question.answers = shuffledArr;
      question.correctAnswerIndex = newIndex;
      updatedQuestions.push(question);
    }
    return updatedQuestions;
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

  private shuffleArray(arr: any[]) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  async deleteQuestionsByDate() {
    const date = new Date();
    date.setHours(0, 0, 0, 0);

    await this.questionsByDateModel.deleteOne({ date: { $eq: date } });
  }

  async getFresh(questionLength = 20, tags: string[]) {
    const questions = [];
    const usedTags = [];
    const isTagsExist = !!tags?.length;

    while (questions.length < questionLength) {
      const operatorNinTags = { $nin: usedTags };
      const operatorInTags = { $in: tags };
      //Получаем вопрос с датой публикации равной null и тегами, которых не было
      let question = await this.questionModel.findOne({
        _id: { $nin: questions.map((q) => q._id) },
        datePublishEveryDay: { $eq: null },
        tags: isTagsExist ? operatorInTags : operatorNinTags,
      });

      //Получаем вопрос с датой публикации более двух месяцев назад и тегами, которых не было
      if (!question) {
        const twoMonthsAgo = new Date();
        twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);
        question = await this.questionModel.findOne({
          _id: { $nin: questions.map((q) => q._id) },
          datePublishEveryDay: { $lt: twoMonthsAgo },
          tags: isTagsExist ? operatorInTags : operatorNinTags,
        });
      }

      //Получаем вопрос с датой публикации равной null
      if (!question) {
        question = await this.questionModel.findOne({
          _id: { $nin: questions.map((q) => q._id) },
          datePublishEveryDay: { $eq: null },
        });
      }

      //Получаем вопрос с датой публикации более двух месяцев назад
      if (!question) {
        const twoMonthsAgo = new Date();
        twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);
        question = await this.questionModel.findOne({
          _id: { $nin: questions.map((q) => q._id) },
          datePublishEveryDay: { $lt: twoMonthsAgo },
        });
      }

      //Получаем вопрос с тегами, которых не было
      if (!question) {
        question = await this.questionModel.findOne({
          _id: { $nin: questions.map((q) => q._id) },
          tags: isTagsExist ? operatorInTags : operatorNinTags,
        });
      }

      //Получаем вопрос, которого нет в массиве
      if (!question) {
        question = await this.questionModel.findOne({
          _id: { $nin: questions.map((q) => q._id) },
        });
      }

      if (!question) break;

      questions.push(question);
      usedTags.push(question.tags[3] || question.tags[2] || '');
    }

    return questions;

    // Старый метод
    // Получаем вопросы без даты публикации
    // let questions =
    //   (await this.questionModel.find({
    //     datePublishEveryDay: { $eq: null },
    //   })) || [];

    // if (questions.length < questionLength) {
    //   // Получаем вопросы с датой публикации более двух месяцев назад
    //   const twoMonthsAgo = new Date();
    //   twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);
    //   const questionsWithOldDate = await this.questionModel.find({
    //     datePublishEveryDay: { $lt: twoMonthsAgo },
    //   });

    //   questions = questions.concat(questionsWithOldDate);

    //   if (questions.length < questionLength) {
    //     // Получаем случайные вопросы, исключая те, которые уже есть в предыдущих массивах
    //     const randomQuestions = await this.questionModel.aggregate([
    //       {
    //         $match: {
    //           _id: {
    //             $nin: questions.map((q) => q._id),
    //           },
    //         },
    //       },
    //       {
    //         $sample: {
    //           size: questionLength - questions.length,
    //         },
    //       },
    //     ]);

    //     questions = questions.concat(randomQuestions);
    //   }
    // }
    // return questions.slice(0, questionLength);
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
