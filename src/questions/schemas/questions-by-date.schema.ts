import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class QuestionsByDate {
  @Prop({ required: true })
  date: Date;

  @Prop({ required: true, default: [] })
  questionsIds: string[];
}

export const QuestionsByDateSchema =
  SchemaFactory.createForClass(QuestionsByDate);

QuestionsByDateSchema.methods.toJSON = function () {
  const obj = this.toObject();
  obj.id = obj._id;
  delete obj.__v;
  delete obj._id;
  return obj;
};
