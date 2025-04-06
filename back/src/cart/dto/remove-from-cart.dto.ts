import { IsArray, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class RemoveFromCartDto {
  @IsArray()
  @IsNumber({}, { each: true })
  @Type(() => Number)
  itemIds: number[];
} 