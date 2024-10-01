import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PathLevelDocument = PathLevel & Document;

@Schema()
export class PathLevel {
  @Prop({ required: true })
  pathId: string;

  @Prop({ type: [String] })
  exams: string[];  // Array of exams

  @Prop({ type: [String] })
  stories: string[];  // Array of stories
}

export const PathLevelSchema = SchemaFactory.createForClass(PathLevel);
