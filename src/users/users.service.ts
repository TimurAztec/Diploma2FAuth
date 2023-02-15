import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { CreateUserDto } from './user.dto';
import { User, UserDocument } from './user.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {

    constructor(@InjectModel(User.name) private model: Model<UserDocument>) {}

    public async findOneByName(name: string): Promise<User> {
        return await this.model.findOne({name}).exec();
    }

    public async findOneByEmail(email: string): Promise<User> {
        return await this.model.findOne({email}).exec();
    }

    public async create(user: User): Promise<User> {
        const userExists: User = await this.model.findOne({email: user.email}).exec();
        if (userExists) throw new BadRequestException('User already exist');

        const salt = await bcrypt.genSalt();
        const hash = await bcrypt.hash(user.password, salt);
        user = {
            ...user,
            password: hash
        };
        let dbresponse: User = await new this.model({
            ...user,
            createdAt: new Date(),
            updatedAt: new Date()
        }).save();
        return dbresponse;
    }

    public async modify(id: number): Promise<User> {
        return await this.model.findById(id).exec();
    }

    public async findOne(id: number): Promise<User> {
        return await this.model.findById(id).exec();
    }

    public async findAll(): Promise<Array<User>> {
        return await this.model.find().exec();
    }

    public async delete(id: number): Promise<User> {
        return await this.model.findByIdAndDelete(id).exec();
    }
}
