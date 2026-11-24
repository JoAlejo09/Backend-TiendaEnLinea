import { IsOptional, IsString, Length, MaxLength} from 'class-validator';

export class CreateCategoryDto{
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
}