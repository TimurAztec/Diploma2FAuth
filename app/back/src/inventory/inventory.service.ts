import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Item, ItemDocument } from "./item.schema";
import { Model, Types } from "mongoose";
import { ItemDto } from "./item.dto";

@Injectable()
export class InventoryService {
    constructor(@InjectModel(Item.name) private model: Model<ItemDocument>) {}

    public async findOneByName(name: string): Promise<Item> {
        return await this.model.findOne({name}).exec();
    }

    public async create(item: ItemDto): Promise<Item> {
        let dbresponse: Item = await new this.model({
            ...item,
            quantity: Number(item.quantity),
            createdAt: new Date(),
            updatedAt: new Date()
        }).save();
        return dbresponse;
    }

    public async modify(newItem: ItemDto): Promise<Item> {
        const item = await this.model.findById(new Types.ObjectId(newItem._id)).exec();
        item.name = newItem.name;
        item.quantity = Number(newItem.quantity);
        item.location = newItem.location;
        item.updatedAt = new Date();
        return item.save();
    }

    public async findOne(id: Types.ObjectId): Promise<Item> {
        return await this.model.findById(id).exec();
    }

    public async findAll(): Promise<Array<Item>> {
        return await this.model.find().exec();
    }

    public async delete(id: number): Promise<Item> {
        return await this.model.findByIdAndDelete(id).exec();
    }    
}
