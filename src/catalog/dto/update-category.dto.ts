import { IsOptional, IsString, Length, MaxLength } from 'class-validator';

export class UpdateCategoryDto{

        @IsOptional()
        @IsString()
        @Length(1,30)
        code?:string;
    
        @IsOptional()
        @IsString()
        @Length(1,100)
        name?:string;
    
        @IsOptional()
        @IsString()
        @MaxLength(500)
        description?:string | null;
}