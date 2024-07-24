import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { User } from './user.schema';
import mongoose from 'mongoose';

@Schema()
export class UserStats {
  @Prop({ unique: true, required: true })
  userId: number;

  @Prop({ required: false, default: 0 })
  questionsAnswer?: number;

  @Prop({ required: false, default: 0 })
  questionsAnswerTrue?: number;

  @Prop({ required: false, default: 0 })
  loginCountDays?: number;

  @Prop({ required: false, default: null })
  loginLast?: Date | null;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;
}

export const UserStatsSchema = SchemaFactory.createForClass(UserStats);

UserStatsSchema.methods.toJSON = function () {
  const obj = this.toObject();
  obj.id = obj._id;
  delete obj.__v;
  delete obj._id;
  return obj;
};
