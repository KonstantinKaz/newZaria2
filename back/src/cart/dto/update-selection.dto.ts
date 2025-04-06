import { IsArray, IsBoolean } from 'class-validator';

export class UpdateSelectionDto {
  @IsArray()
  itemIds: number[];

  @IsBoolean()
  selected: boolean;
} 