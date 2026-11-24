import { IsInt, IsOptional, IsString, Length, MaxLength, Min } from 'class-validator';

export class CreateSubcategoryDto{
    @IsString()
    @Length(1,30)
    code!:string

    @IsString()
    @Length(1,100)
    name!:string

    @IsOptional()
    @IsString()
    @MaxLength(500)
    description?:string

    @IsInt()
    @Min(1)
    categoryId!:number
}