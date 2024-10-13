import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type VirtualTeacherDocument = VirtualTeacher & Document;

@Schema()
export class VirtualTeacher {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  prompt: string;

  
}

export const VirtualTeacherSchema = SchemaFactory.createForClass(VirtualTeacher);