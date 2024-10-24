import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type VirtualTeacherDocument = VirtualTeacher & Document;

@Schema()
export class Message {
  @Prop({ type: String, required: true })
  text: string; // The message text (user's prompt or chatbot's response)

  @Prop({ type: String, required: true })
  source: 'user' | 'chatbot'; // Indicates if the message is from the user or chatbot

  @Prop({ type: Date, default: Date.now })
  createdAt: Date; // Timestamp when the message was created
}

export const MessageSchema = SchemaFactory.createForClass(Message);

@Schema()
export class VirtualTeacher {
  @Prop({ type: String, required: true })
  userId: string; // The user initiating the chat

  @Prop({ type: String, required: true, unique: true })
  chatId: string; // Unique identifier for the chat session

  @Prop({ type: [MessageSchema], default: [] })
  messages: Message[]; // Array of messages exchanged in the chat session

  @Prop({ type: Date, default: Date.now })
  createdAt: Date; // When the chat session was created
}

export const VirtualTeacherSchema = SchemaFactory.createForClass(VirtualTeacher);
