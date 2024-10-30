
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  [x: string]: any;
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  name: string;
  @Prop()
  level: string;
  @Prop()
  score: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
