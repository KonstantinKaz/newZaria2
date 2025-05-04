import { AuthDto } from '@/auth/dto/auth.dto'
import { Injectable, NotFoundException } from '@nestjs/common'
import type { User } from '@prisma/client'
import { hash } from 'argon2'

import { PrismaService } from '@/prisma/prisma.service'
import { UpdateUserDto } from './dto/update-user.dto'

@Injectable()
export class UserService {
	constructor(private prisma: PrismaService) {}

	async getUsers() {
		return this.prisma.user.findMany({
			select: {
				id: true,
				name: true,
				email: true
			}
		})
	}

	async getById(id: string) {
		return this.prisma.user.findUnique({
			where: { id }
		})
	}

	async getByEmail(email: string) {
		return this.prisma.user.findUnique({
			where: { email }
		})
	}

	async create(dto: AuthDto) {
		return this.prisma.user.create({
			data: {
				...dto,
				password: await hash(dto.password)
			}
		})
	}

	async update(id: string, data: Partial<User>) {
		return this.prisma.user.update({
			where: { id },
			data
		})
	}

	async findById(id: string) {
		const user = await this.prisma.user.findUnique({
			where: { id },
			select: {
				id: true,
				email: true,
				name: true,
				surname: true,
				patronymic: true,
				phone: true,
				birthday: true,
				gender: true,
				rights: true,
				password: true
			}
		})

		if (!user) throw new NotFoundException('User not found')
		return user
	}

	async updateProfile(id: string, dto: UpdateUserDto) {
		const isSameUser = await this.prisma.user.findUnique({
			where: { email: dto.email }
		})

		if (isSameUser && id !== isSameUser.id)
			throw new NotFoundException('Email already in use')

		const user = await this.findById(id)

		const data: Partial<User> = {
			email: dto.email,
			name: dto.name,
			surname: dto.surname,
			patronymic: dto.patronymic,
			phone: dto.phone,
			birthday: dto.birthday,
			gender: dto.gender
		}

		if (dto.password) {
			data.password = await hash(dto.password)
		}

		return this.prisma.user.update({
			where: { id },
			data
		})
	}
}
