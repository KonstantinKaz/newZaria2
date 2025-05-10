import { IsString, IsNumber, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateProductDto {
  @IsString()
  title: string;

  @IsNumber()
  @Transform(({ value }) => Number(value))
  price: number;

  @IsString()
  description: string;

  @IsNumber()
  @Transform(({ value }) => Number(value))
  categoryId: number;

  @IsOptional()
  images?: string[];

  @IsNumber()
  @Transform(({ value }) => Number(value))
  quantity: number;
}
