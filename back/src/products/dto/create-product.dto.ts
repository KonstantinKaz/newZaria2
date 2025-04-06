import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateProductDto {
  @IsString()
  title: string;

  @IsNumber()
  price: number;

  @IsString()
  description: string;

  @IsNumber()
  categoryId: number;

  @IsOptional()
  images?: string[];

  @IsNumber()
  quantity: number;
}
