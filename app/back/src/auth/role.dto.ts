import { IsNotEmpty, IsString } from "class-validator";
import { Types } from "mongoose";

export class UpdateRoleDto {
    @IsNotEmpty()
    @IsString()
    readonly id: Types.ObjectId;

    @IsNotEmpty()
    @IsString({ each: true })
    readonly permissions: string[];

    @IsNotEmpty()
    @IsString()
    readonly name: string;
}

export class RoleDto {

    @IsNotEmpty()
    @IsString({ each: true })
    readonly permissions: string[];

    @IsNotEmpty()
    @IsString()
    readonly name: string;
}