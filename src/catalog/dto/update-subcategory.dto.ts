import { IsInt, IsOptional, IsString, Length, MaxLength, Min, ValidateIf,} from 'class-validator';

export class UpdateSubcategoryDto {
  @ValidateIf((_object, value) => value !== undefined)
  @IsString()
  @Length(1, 30)
  code?: string;

  @ValidateIf((_object, value) => value !== undefined)
  @IsString()
  @Length(1, 100)
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string | null;

  @ValidateIf((_object, value) => value !== undefined)
  @IsInt()
  @Min(1)
  categoryId?: number;
}