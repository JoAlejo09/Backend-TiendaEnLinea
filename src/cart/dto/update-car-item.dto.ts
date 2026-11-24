import { IsInt, Min } from "class-validator";

export class UpdateCarItemDto{
        @IsInt()
        @Min(1)
        quantity!:number
}