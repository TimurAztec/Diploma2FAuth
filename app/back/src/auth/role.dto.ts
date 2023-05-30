import { IsNotEmpty, IsNumberString, IsString } from "class-validator";
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

    @IsNotEmpty()
    @IsNumberString()
    readonly priority: number;
}

export class RoleDto {

    @IsNotEmpty()
    @IsString({ each: true })
    readonly permissions: string[];

    @IsNotEmpty()
    @IsString()
    readonly name: string;

    @IsNotEmpty()
    @IsNumberString()
    readonly priority: number;
}