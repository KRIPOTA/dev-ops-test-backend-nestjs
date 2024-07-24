import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { UserStats } from './stats.schema';
import mongoose from 'mongoose';

@Schema()
export class User {
  @Prop({ unique: true, required: true })
  tgId: number;

  @Prop({ required: false, default: false })
  isBot?: boolean;

  @Prop({ required: false, default: '' })
  firstName?: string;

  @Prop({ required: false, default: '' })
  lastName?: string;

  @Prop({ required: false, default: '' })
  username?: string;

  @Prop({ required: false, default: '' })
  photoUrl?: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserStats',
  })
  stats: UserStats;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.methods.toJSON = function () {
  const obj = this.toObject();
  obj.id = obj._id;
  delete obj.__v;
  delete obj._id;
  return obj;
};
