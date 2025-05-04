import {
	IsBoolean,
	IsDateString,
	IsInt,
	IsNumber,
	IsOptional,
	IsString,
	Max,
	Min
} from 'class-validator'

export class CreatePromocodeDto {
	@IsString()
	code: string

	@IsNumber()
	@Min(0)
	@Max(100)
	discount: number

	@IsOptional()
	@IsNumber()
	@Min(1)
	usageLimit?: number

	@IsOptional()
	@IsDateString()
	expiresAt?: string

	@IsString()
	@IsOptional()
	description?: string

	@IsInt()
	@IsOptional()
	@Min(0)
	maxUses?: number

	@IsString()
	@IsOptional()
	validUntil?: string

	@IsBoolean()
	@IsOptional()
	isActive?: boolean
}
