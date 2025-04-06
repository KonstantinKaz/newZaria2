import { Type } from 'class-transformer';
import { IsArray, IsNumber, IsPositive, ValidateNested } from 'class-validator';

export class AddToCartItemDto {
  @IsNumber()
  @IsPositive()
  productId: number;

  @IsNumber()
  @IsPositive()
  quantity: number;
}

export class AddToCartDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AddToCartItemDto)
  items: AddToCartItemDto[];
} 