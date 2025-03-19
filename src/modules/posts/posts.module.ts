import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { PostView } from './entities/post-view.entity';
import { PostRoleGuard } from './guards/post-role.guard';

@Module({
  imports: [TypeOrmModule.forFeature([Post, PostView])],
  controllers: [PostsController],
  providers: [PostsService, PostRoleGuard],
  exports: [PostsService],
})
export class PostsModule {}
