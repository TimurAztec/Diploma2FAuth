import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { Event } from "./event.schema";
import { EventDocument } from "./event.schema";
import { EventDto } from "./event.dto";

@Injectable()
export class EventsService {
    constructor(@InjectModel(Event.name) private model: Model<EventDocument>) {}

    public async findOneByName(name: string): Promise<Event> {
        return await this.model.findOne({name}).exec();
    }

    public async create(item: EventDto): Promise<Event> {
        let dbresponse: Event = await new this.model({
            ...item,
            createdAt: new Date(),
            updatedAt: new Date()
        }).save();
        return dbresponse;
    }

    public async modify(newItem: EventDto): Promise<Event> {
        const item = await this.model.findById(new Types.ObjectId(newItem._id)).exec();
        item.title = newItem.title;
        item.location = newItem.location;
        item.description = newItem.description;
        item.start = newItem.start;
        item.end = newItem.end;
        item.updatedAt = new Date();
        return item.save();
    }

    public async findOne(id: Types.ObjectId): Promise<Event> {
        return await this.model.findById(id).exec();
    }

    public async findAll(): Promise<Array<Event>> {
        return await this.model.find().exec();
    }

    public async delete(id: number): Promise<Event> {
        return await this.model.findByIdAndDelete(id).exec();
    }    
}
