import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import * as cookieParser from 'cookie-parser'
import { RequestMethod } from '@nestjs/common'
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
	const app = await NestFactory.create(AppModule)

	app.useGlobalPipes(
		new ValidationPipe({
			transform: true,
			transformOptions: { enableImplicitConversion: true },
			whitelist: true,
		}),
	)

	app.setGlobalPrefix('api', {
		exclude: [
			// { path: 'auth/google', method: RequestMethod.GET },
			// { path: 'auth/google/redirect', method: RequestMethod.GET },
			// { path: 'auth/github', method: RequestMethod.GET },
			// { path: 'auth/github/redirect', method: RequestMethod.GET },
			{ path: 'verify-email', method: RequestMethod.GET }
		]
	})
	
	app.use(cookieParser())
	app.enableCors({
		origin: ['https://newzaria.ilyacode.ru', 'https://api.newzaria.ilyacode.ru', 'http://localhost:5173'],
		credentials: true,
		exposedHeaders: 'set-cookie',
		methods: ['POST', 'PUT', 'GET', 'OPTIONS', 'DELETE', 'PATCH']
	})
	await app.listen(9982)
}
bootstrap()
