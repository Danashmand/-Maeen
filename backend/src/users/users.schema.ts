import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
class Levels {
  @Prop({ default: 0 })
  writing: number;

  @Prop({ default: 0 })
  reading: number;

  @Prop({ default: 0 })
  grammar: number;
}

const LevelsSchema = SchemaFactory.createForClass(Levels);

@Schema()
export class User {
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
