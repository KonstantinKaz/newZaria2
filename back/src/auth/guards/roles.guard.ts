import {
	CanActivate,
	ExecutionContext,
	ForbiddenException,
	Injectable,
	Logger
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Role, User } from '@prisma/client'
import { Request } from 'express'

@Injectable()
export class RolesGuard implements CanActivate {
	private readonly logger = new Logger(RolesGuard.name)

	constructor(private reflector: Reflector) {}

	canActivate(context: ExecutionContext): boolean {
		const roles = this.reflector.get<Role[]>('roles', context.getHandler())
		if (!roles || roles.length === 0) {
			return true
		}

		const request = context.switchToHttp().getRequest<Request>()
		const user = request.user as User

		if (!user || !user.rights) {
			this.logger.warn('User or user roles not found in request')
			throw new ForbiddenException('Пользователь не авторизован')
		}

		this.logger.debug(
			`Checking roles. Required: ${roles.join(', ')}, User has: ${user.rights.join(', ')}`
		)

		const hasRole = user.rights.some(role => roles.includes(role))

		if (!hasRole) {
			this.logger.warn(
				`Access denied for user ${user.id}. Required roles: ${roles.join(', ')}, User roles: ${user.rights.join(', ')}`
			)
			throw new ForbiddenException(
				'У вас нет необходимых прав для этого действия'
			)
		}

		this.logger.debug(`Access granted for user ${user.id}`)
		return true
	}
}
