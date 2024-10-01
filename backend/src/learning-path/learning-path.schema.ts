import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type LearningPathDocument = LearningPath & Document;

@Schema()
export class LearningPath {
  @Prop({ required: true })
  pathId: string;

  @Prop({ required: true })
  pathLength: number;

  @Prop({ required: true })
  progress: number;

  @Prop({ required: true })
  pathLevel: string;

  @Prop({ required: true })
  userId: string;  // Reference to User
}

export const LearningPathSchema = SchemaFactory.createForClass(LearningPath);
