
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type EventDocument = HydratedDocument<Event>;

@Schema()
export class Event {
  _id: Types.ObjectId;

  @Prop({required: true})
  title: string;

  @Prop({required: true})
  location: string;

  @Prop({required: true})
  description: string;

  @Prop({required: true})
  start: Date;

  @Prop({required: true})
  end: Date;

  @Prop({required: true})
  createdAt: Date;

  @Prop({required: true})
  updatedAt: Date;
}

export const EventSchema = SchemaFactory.createForClass(Event);
