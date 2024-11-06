import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

// Type for the document interface
export type FirstExamDocument = FirstExam & Document;

@Schema()
export class FirstExam {
  @Prop({ required: false })
  userId: string;

  @Prop({ type: [String], required: false })  // Array of question strings
  questions: string[];

  // Optional: You can add additional properties if needed, such as the levels or topics
  @Prop({ type: Object, required: false })
  levels: { [key: string]: number };

  @Prop({ required: false })
  topic: string;

  // You can also store metadata or history of the exam, if required
  @Prop({ default: Date.now })
  createdAt: Date;
}

// Create the schema
export const FirstExamSchema = SchemaFactory.createForClass(FirstExam);
