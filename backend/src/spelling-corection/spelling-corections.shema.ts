import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class SpellingCorrection extends Document {
  @Prop({ required: true, type: String })
  question: string;

  @Prop({
    type: Object,
    required: true,
    default: { writing: 0, reading: 0, grammer: 0 },
    validate: {
      validator: (v: any) => {
        return (
          typeof v.writing === 'number' &&
          typeof v.reading === 'number' &&
          typeof v.grammer === 'number'
        );
      },
      message: (props: any) => `${props.value} is not a valid levels object!`,
    },
  })
  levels: {
    writing: number;
    reading: number;
    grammer: number;
  };
}

export const SpellingCorrectionSchema = SchemaFactory.createForClass(SpellingCorrection);