import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class ImproveReading extends Document {
  @Prop({ required: true })
  levels: string;

  @Prop()
  title: string;

  @Prop()
  content: string;
}

export const ImproveReadingSchema = SchemaFactory.createForClass(ImproveReading);
