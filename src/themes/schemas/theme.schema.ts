import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Theme {
  id: string;

  @Prop({ required: true })
  theme: string;

  @Prop({ required: true, default: [] })
  tags: string[];
}

export const ThemeSchema = SchemaFactory.createForClass(Theme);

ThemeSchema.methods.toJSON = function () {
  const obj = this.toObject();
  obj.id = obj._id;
  delete obj.__v;
  delete obj._id;
  return obj;
};
