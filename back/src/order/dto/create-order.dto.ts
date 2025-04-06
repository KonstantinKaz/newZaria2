import { IsArray, IsEmail, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateOrderDto {
  @IsArray()
  @IsNumber({}, { each: true })
  @Type(() => Number)
  cartItemIds: number[];

  @IsEmail()
  email: string;
} 