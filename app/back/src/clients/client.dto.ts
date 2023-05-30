import { IsNotEmpty, IsString } from "class-validator";
import { Types } from "mongoose";

export class CreateClientDto {
    @IsString()
    readonly email: string;

    @IsString()
    readonly description: string;

    @IsNotEmpty()
    @IsString()
    readonly name: string;

    @IsNotEmpty()
    @IsString()
    readonly phone: string;
}

export class UpdateClientDto {
    @IsNotEmpty()
    @IsString()
    readonly _id: Types.ObjectId;

    @IsString()
    readonly email: string;

    @IsString()
    readonly description: string;

    @IsString()
    readonly name: string;

    @IsString()
    readonly phone: string;
}
