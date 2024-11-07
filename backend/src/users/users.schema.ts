import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
class Levels {
  @Prop({ default: 1 })
  writing: number;

  @Prop({ default: 1 })
  reading: number;

  @Prop({ default: 1 })
  grammar: number;
}

const LevelsSchema = SchemaFactory.createForClass(Levels);

@Schema()
export class User {
  [x: string]: any;
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  name: string;

  @Prop({ type: LevelsSchema, default: {} })
  levels: Levels;

  @Prop({ default: 0 })
  score: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
