import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Question {
  id: string;

  @Prop({ required: true })
  question: string;

  @Prop({ required: true, default: [] })
  answers: string[];

  @Prop({ required: true })
  correctAnswerIndex: number;

  @Prop({ required: false, default: '' })
  explanation?: string;

  @Prop({ type: Date, default: Date.now })
  dateInsert?: Date;

  @Prop({ type: Date, required: false, default: null })
  datePublishEveryDay?: Date | null;

  @Prop({ required: false, default: 0 })
  countPublish?: number;

  @Prop({ required: false, default: 0 })
  countTrueAnswer?: number;

  @Prop({ required: false, default: [] })
  tags?: string[];
}

export const QuestionSchema = SchemaFactory.createForClass(Question);

QuestionSchema.methods.toJSON = function () {
  const obj = this.toObject();
  obj.id = obj._id;
  delete obj.__v;
  delete obj._id;
  return obj;
};
