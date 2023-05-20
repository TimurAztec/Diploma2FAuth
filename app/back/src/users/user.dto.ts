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
    readonly name: string;

    @IsNotEmpty()
    @IsString()
    readonly password: string;
}

export class UpdateUserDto {
    @IsNotEmpty()
    @IsString()
    readonly id: Types.ObjectId;

    @IsNotEmpty()
    @IsString()
    readonly email: string;

    @IsNotEmpty()
    @IsString()
    readonly name: string;

    @IsNotEmpty()
    @IsString()
    readonly role: string;
}

export interface ReturnUser {
    readonly id: Types.ObjectId;
    readonly email: string;
    readonly name: string;
    readonly role: Role;
}