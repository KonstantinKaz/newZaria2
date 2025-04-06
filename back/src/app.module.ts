import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ProductsModule } from './products/products.module'
import { PrismaModule } from './prisma/prisma.module'
import { PrismaService } from './prisma/prisma.service'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { AuthModule } from './auth/auth.module'
import { UserModule } from './user/user.module'
import { CategoriesModule } from './categories/categories.module';
import { CartModule } from './cart/cart.module';
import { OrderModule } from './order/order.module';
import { PaymentModule } from './payment/payment.module';
import { ServeStaticModule } from '@nestjs/serve-static'
import { join } from 'path'
import { FavoritesModule } from './favorites/favorites.module'
@Module({
	imports: [
		ServeStaticModule.forRoot({
			rootPath: join(__dirname, '..', '../uploads'),
			serveRoot: '/uploads',
		}),
		ProductsModule,
		PrismaModule,
		ConfigModule.forRoot({
			isGlobal: true
		}),
		AuthModule,
		UserModule,
		CategoriesModule,
		CartModule,
		OrderModule,
		PaymentModule,
		FavoritesModule
	],
	controllers: [AppController],
	providers: [AppService, PrismaService]
})
export class AppModule {}
