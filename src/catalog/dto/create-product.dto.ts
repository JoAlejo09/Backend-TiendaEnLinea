import { IsInt, IsNumber, IsOptional, IsString, Length, MaxLength, Min} from 'class-validator';

export class CreateProductDto{
    @IsString()
    @Length(1,30)
    code!: string

    @IsString()
    @Length(1,150)
    name!:string;

    @IsString()
    @Length(1,100)
    brand!: string;

    @IsOptional()
    @IsString()
    @MaxLength(500)
    characteristics?:string

    @IsString()
    @Length(1,100)
    presentation!:string;

    @IsNumber({maxDecimalPlaces:2})
    @Min(0.01)
    price!:number;

    @IsInt()
    @Min(1)
    subcategoryId!:number;

    @IsOptional()
    @IsString()
    @MaxLength(100)
    description?:string
}