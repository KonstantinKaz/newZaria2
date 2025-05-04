import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator'

export class UpdateUserDto {
	@IsEmail()
	email: string

	@IsString()
	name: string

	@IsString()
	surname: string

	@IsString()
	@IsOptional()
	patronymic?: string

	@IsString()
	@IsOptional()
	phone?: string

	@IsString()
	birthday: string

	@IsString()
	gender: string

	@IsString()
	@MinLength(6)
	@IsOptional()
	password?: string
}
