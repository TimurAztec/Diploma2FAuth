import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ReturnsNewDoc, Types } from 'mongoose';
import { User, UserDocument } from './user.schema';
import * as bcrypt from 'bcrypt';
import { ReturnUser, UpdateUserDto } from './user.dto';
import { GlobalConstants } from 'src/misc/constants';
import { Role } from 'src/auth/role.schema';
import { RoleService } from 'src/auth/role.service';

@Injectable()
export class UsersService {

    constructor(@InjectModel(User.name) private model: Model<UserDocument>,
                protected readonly rolesService: RoleService) {}

    public async findOneByName(name: string): Promise<User> {
        return await this.model.findOne({name}).populate('role').lean().exec();
    }

    public async findOneByEmail(email: string): Promise<User> {
        return await this.model.findOne({email}).populate('role').lean().exec();
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
        const defaultRole: Role = await this.rolesService.findOneByName(GlobalConstants.Roles.DEFAULT_ROLE);
        let dbresponse: User = await new this.model({
            ...user,
            role: defaultRole,
            createdAt: new Date(),
            updatedAt: new Date()
        }).save();
        return dbresponse;
    }

    public async modify(newUser: User): Promise<User> {
        const user = await this.model.findById(newUser._id).exec();
        user.name = newUser.name;
        user.email = newUser.email;
        user.phone = newUser.phone;
        user.description = newUser.description;
        user.password = newUser.password;
        user.role = newUser.role;
        user.twofasecret = newUser.twofasecret;
        user.updatedAt = new Date();
        return user.save();
    }

    public async findOne(id: Types.ObjectId): Promise<User> {
        return await this.model.findById(id).populate('role').lean().exec();
    }

    public async findAll(): Promise<Array<User>> {
        return await this.model.find().populate('role').lean().exec();
    }

    public async delete(id: Types.ObjectId): Promise<User> {
        return await this.model.findByIdAndDelete(id).exec();
    }
}
