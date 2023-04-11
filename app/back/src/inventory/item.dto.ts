import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsString, Max, Min } from "class-validator";

export class ItemDto {
    readonly _id: string;

    @IsNotEmpty()
    @IsString()
    readonly name: string;

    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    @Min(0)
    @Max(Number.MAX_VALUE)
    readonly quantity: number;

    @IsNotEmpty()
    @IsString()
    readonly location: string;
}