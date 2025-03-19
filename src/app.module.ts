import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { ErrorHandlingMiddleware } from './middlewares/error-handling.middleware';
import { AppConfigModule } from './config/app/config.module';
import { S3Module } from './modules/s3/s3.module';
import { PostsModule } from './modules/posts/posts.module';
import { AppDataSource } from 'src/ormconfig';
import { ConfigModule } from '@nestjs/config';
import { AwsConfigModule } from './config/aws/config.module';
import { CommentsModule } from './modules/comments/comments.module';
import { ImagesModule } from './modules/images/images.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(AppDataSource.options),
    AuthModule,
    UsersModule,
    S3Module,
    PostsModule,
    AppConfigModule,
    AwsConfigModule,
    CommentsModule,
    ImagesModule,
    // DbConfigModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ErrorHandlingMiddleware).forRoutes('*');
  }
}
