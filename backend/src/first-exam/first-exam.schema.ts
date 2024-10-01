import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type FirstExamDocument = FirstExam & Document;

@Schema()
export class FirstExam {
  @Prop({ required: true })
  userId: string;

  @Prop({ type: [String] })  // Array of questions
  questions: string[];
}

export const FirstExamSchema = SchemaFactory.createForClass(FirstExam);
