import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Client, ClientDocument } from './client.schema';
import { CreateClientDto } from './client.dto';

@Injectable()
export class ClientsService {

    constructor(@InjectModel(Client.name) private model: Model<ClientDocument>) {}

    public async findOneByName(name: string): Promise<Client> {
        return await this.model.findOne({name}).lean().exec();
    }

    public async findOneByEmail(email: string): Promise<Client> {
        return await this.model.findOne({email}).lean().exec();
    }

    public async create(client: CreateClientDto): Promise<Client> {
        const clientExists: Client = await this.model.findOne({phone: client.phone}).exec();
        if (clientExists) throw new BadRequestException('Client already exist');

        let dbresponse: Client = await new this.model({
            ...client,
            createdAt: new Date(),
            updatedAt: new Date()
        }).save();
        return dbresponse;
    }

    public async modify(newClient: Client): Promise<Client> {
        const client = await this.model.findById(newClient._id).exec();
        client.email = newClient.email || client.email;
        client.description = newClient.description || client.description;
        client.name = newClient.name || client.name;
        client.phone = newClient.phone || client.phone;
        client.updatedAt = new Date();
        return client.save();
    }

    public async findOne(id: Types.ObjectId): Promise<Client> {
        return await this.model.findById(id).lean().exec();
    }

    public async findAll(): Promise<Array<Client>> {
        return await this.model.find().lean().exec();
    }

    public async delete(id: Types.ObjectId): Promise<Client> {
        return await this.model.findByIdAndDelete(id).exec();
    }
}
