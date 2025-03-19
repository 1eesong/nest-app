import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { Comment } from './entities/comment.entity';
import { Post } from '../posts/entities/post.entity';
import { User } from '../users/entities/user.entity';
import { PostsModule } from '../posts/posts.module';
import { CommentRoleGuard } from './guards/comment-role.guard';

@Module({
  imports: [TypeOrmModule.forFeature([Comment]), PostsModule],
  controllers: [CommentsController],
  providers: [CommentsService, CommentRoleGuard],
})
export class CommentsModule {}
