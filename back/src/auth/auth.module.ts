import { EmailModule } from '@/email/email.module'
import { PrismaService } from '@/prisma/prisma.service'
import { UserModule } from '@/user/user.module'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { RefreshTokenService } from './refresh-token.service'
import { JwtStrategy } from './strategies/jwt.strategy'

@Module({
	imports: [
		ConfigModule,
		UserModule,
		PassportModule,
		JwtModule.registerAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: (configService: ConfigService) => ({
				secret: configService.get('JWT_SECRET'),
				signOptions: { expiresIn: '30d' }
			})
		}),
		EmailModule
	],
	controllers: [AuthController],
	providers: [JwtStrategy, PrismaService, AuthService, RefreshTokenService],
	exports: [AuthService, JwtModule]
})
export class AuthModule {}
