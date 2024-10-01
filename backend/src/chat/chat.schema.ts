import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ChatDocument = Chat & Document;

@Schema()
export class Chat {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  prompt: string;

  @Prop({ required: true })
  answer: string;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
