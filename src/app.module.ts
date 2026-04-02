import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { BooksModule } from './books/books.module';
import { JwtGlobalAuthGuard } from './auth/jwt/jwt-global-auth.guard';
import { RolesGuard } from './auth/common/guards/roles.guard';

@Module({
  imports: [
    MongooseModule.forRoot(`${process.env.MONGO_URI}/${process.env.DB_NAME}`),
    AuthModule,
    UsersModule,
    BooksModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtGlobalAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
