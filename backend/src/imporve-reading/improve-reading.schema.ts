import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

// Define the ImproveReading schema
@Schema()
export class ImproveReading extends Document {
  @Prop({
    type: {
      writing: { type: Number, required: true },
      reading: { type: Number, required: true },
      grammar: { type: Number, required: true },
    },
    required: false,
  })
  levels: {
    writing: number;
    reading: number;
    grammar: number;
  };

  @Prop()
  title: string;

  @Prop()
  content: string;
}

// Create and export the schema
export const ImproveReadingSchema = SchemaFactory.createForClass(ImproveReading);
