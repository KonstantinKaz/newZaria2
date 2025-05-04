import {
	IsEmail,
	IsOptional,
	IsString
} from 'class-validator'

export class CreateOrderDto {
	@IsEmail()
	email: string

	@IsString()
	@IsOptional()
	promocodeId?: string
}
