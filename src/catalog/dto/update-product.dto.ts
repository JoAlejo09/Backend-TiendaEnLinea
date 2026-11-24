import{ IsInt, isInt, IsNumber, IsOptional, isString, IsString, Length, MaxLength, Min, ValidateIf } from 'class-validator';

export class UpdateProductDto{
    @ValidateIf((_object, value)=>value !== undefined)
    @IsString()
    @Length(1,30)
    code?: string;

    @ValidateIf((_object, value)=> value !== undefined)
    @IsString()
    @Length(1,150)
    name?:string;

    @ValidateIf((_object, value)=> value!==undefined)
    @IsString()
    @Length(1,100)
    brand?:string;
    
    @IsOptional()
    @IsString()
    @MaxLength(500)
    characteristics?:string| null;

    @ValidateIf((_object, value)=> value!==undefined)
    @IsString()
    @Length(1,100)
    presentation?:string

    @ValidateIf((_object, value)=> value!==undefined)
    @IsNumber({maxDecimalPlaces:2})
    @Min(0.01)
    price?:number

    @ValidateIf((_object, value) => value !== undefined)
    @IsInt()
    @Min(1)
    subcategoryId?: number;

    @IsOptional()
    @IsString()
    @MaxLength(1000)
    description?: string | null;

}