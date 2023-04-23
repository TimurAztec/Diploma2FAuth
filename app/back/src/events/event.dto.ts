import { Type } from "class-transformer";
import { IsDate, IsNotEmpty, IsNumber, IsString, Max, Min } from "class-validator";

export class EventDto {
    readonly _id: string;

    @IsNotEmpty()
    @IsString()
    readonly title: string;

    @IsNotEmpty()
    @IsString()
    readonly location: string;

    @IsNotEmpty()
    @IsString()
    readonly description: string;

    @IsNotEmpty()
    @Type(() => Date)
    @IsDate()
    readonly start: Date;

    @IsNotEmpty()
    @Type(() => Date)
    @IsDate()
    readonly end: Date;
}