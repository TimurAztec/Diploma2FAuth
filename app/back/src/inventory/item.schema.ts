
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ItemDocument = HydratedDocument<Item>;

@Schema()
export class Item {
  _id: Types.ObjectId;

  @Prop({required: true})
  name: string;

  @Prop({required: true})
  quantity: number;

  @Prop({required: true})
  location: string;

  @Prop({required: true})
  createdAt: Date;

  @Prop({required: true})
  updatedAt: Date;
}

export const ItemSchema = SchemaFactory.createForClass(Item);
