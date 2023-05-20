
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type RoleDocument = HydratedDocument<Role>;

@Schema()
export class Role {
  _id: Types.ObjectId;

  @Prop({required: true})
  name: string;

  @Prop({type: [String], required: true})
  permissions: string[];

  @Prop({required: true})
  createdAt: Date;

  @Prop({required: true})
  updatedAt: Date;
}

export const RoleSchema = SchemaFactory.createForClass(Role);
