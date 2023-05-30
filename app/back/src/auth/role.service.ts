import { BadRequestException, Injectable, OnApplicationBootstrap } from '@nestjs/common';
const util = require('util');
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Role, RoleDocument } from './role.schema';
import { GlobalConstants } from 'src/misc/constants';
import { RoleDto } from './role.dto';

@Injectable()
export class RoleService implements OnApplicationBootstrap {

    constructor(@InjectModel(Role.name) private model: Model<RoleDocument>) {}

    public async findOneByName(name: string): Promise<Role> {
        return await this.model.findOne({name}).exec();
    }

    public async create(role: RoleDto): Promise<Role> {
        const roleExists: Role = await this.model.findOne({name: role.name}).exec();
        if (roleExists) throw new BadRequestException('Role already exist');
        let dbresponse: Role = await new this.model({
            name: role.name,
            permissions: role.permissions,
            priority: role.priority,
            createdAt: new Date(),
            updatedAt: new Date()
        }).save();
        return dbresponse;
    }

    public async modify(newRole: Role): Promise<Role> {
        const role = await this.model.findById(newRole._id).exec();
        role.name = newRole.name;
        role.permissions = newRole.permissions;
        role.priority = newRole.priority;
        role.updatedAt = new Date();
        return role.save();
    }

    public async findOne(id: Types.ObjectId): Promise<Role> {
        return await this.model.findById(id).lean().exec();
    }

    public async findAll(): Promise<Array<Role>> {
        return await this.model.find().lean().exec();
    }

    public async delete(id: Types.ObjectId): Promise<Role> {
        return await this.model.findByIdAndDelete(id).exec();
    }

    public async onApplicationBootstrap(): Promise<void> {
        const defaultRole: Role = await this.findOneByName(GlobalConstants.Roles.DEFAULT_ROLE);
        if (!defaultRole) {
            const defaultRole = new this.model({
                name: GlobalConstants.Roles.DEFAULT_ROLE,
                permissions: ['read'],
                createdAt: new Date(), 
                updatedAt: new Date()
            });
            await defaultRole.save();
        }
    }
}