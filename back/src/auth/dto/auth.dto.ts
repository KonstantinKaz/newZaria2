import { IsEmail, IsString, MinLength, IsOptional, IsDateString } from 'class-validator';

export class AuthDto {
    @IsEmail()
    email: string;

    @MinLength(6, {
        message: 'Password must be at least 6 characters long',
    })
    @IsString()
    password: string;

    @IsString()
    name: string;

	@IsString()
    patronymic: string;

    @IsString()
    surname: string;

    @IsDateString()
    birthday: string;

    @IsString()
    gender: string;
}
