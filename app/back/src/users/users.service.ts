import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {

    constructor(@InjectModel(User.name) private model: Model<UserDocument>) {}

    public async findOneByName(name: string): Promise<User> {
        return await this.model.findOne({name}).exec();
    }

    public async findOneByEmail(email: string): Promise<User> {
        return await this.model.findOne({email}).lean().exec();
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

    public async modify(newUser: User): Promise<User> {
        const user = await this.model.findById(newUser._id).exec();
        user.name = newUser.name;
        user.email = newUser.email;
        user.password = newUser.password;
        user.role = newUser.role;
        user.twofasecret = newUser.twofasecret;
        user.updatedAt = new Date();
        return user.save();
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
