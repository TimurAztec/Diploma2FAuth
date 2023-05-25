
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ClientDocument = HydratedDocument<Client>;

@Schema()
export class Client {
  _id: Types.ObjectId;

  @Prop({required: true})
  name: string;

  @Prop()
  email: string;

  @Prop({required: true})
  phone: string;

  @Prop()
  description: string;

  @Prop({required: true})
  createdAt: Date;

  @Prop({required: true})
  updatedAt: Date;
}

export const ClientSchema = SchemaFactory.createForClass(Client);
