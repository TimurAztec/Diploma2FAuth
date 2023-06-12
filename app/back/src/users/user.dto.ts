import { Type } from "class-transformer";
import { IsNotEmpty, IsString } from "class-validator";
import { Types } from "mongoose";
import { Role } from "src/auth/role.schema";

export class CreateUserDto {
    @IsNotEmpty()
    @IsString()
    readonly email: string;

    @IsNotEmpty()
    @IsString()
    readonly phone: string;

    @IsNotEmpty()
    @IsString()
    readonly name: string;

    @IsNotEmpty()
    @IsString()
    readonly password: string;
}

export class UpdateUserDto {
    @IsNotEmpty()
    @IsString()
    readonly _id: Types.ObjectId;

    @IsNotEmpty()
    @IsString()
    readonly email: string;

    @IsNotEmpty()
    @IsString()
    readonly phone: string;

    readonly description: string;

    @IsNotEmpty()
    @IsString()
    readonly name: string;

    @IsNotEmpty()
    @IsString()
    readonly role: string;
}

export interface ReturnUser {
    readonly _id: Types.ObjectId;
    readonly email: string;
    readonly phone: string;
    readonly description: string;
    readonly name: string;
    readonly role: Role;
}