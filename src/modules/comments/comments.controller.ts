import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Query,
  Param,
  Delete,
  Patch,
  HttpCode,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RequestUser } from 'src/decorators/request-user.decorator';
import { User } from '../users/entities/user.entity';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { CommentRoleGuard } from './guards/comment-role.guard';

@UseGuards(JwtAuthGuard)
@ApiTags('댓글 관리')
@ApiBearerAuth()
@Controller('posts/:postId/comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  @ApiParam({ name: 'postId', type: String, description: '댓글 등록' })
  createComment(
    @Body() createCommentDto: CreateCommentDto,
    @Param('postId') postId: string,
    @RequestUser() user: User,
  ) {
    return this.commentsService.createComment(createCommentDto, postId, user);
  }

  @Post(':commentId/replies')
  @ApiParam({ name: 'postId', type: String })
  @ApiParam({ name: 'commentId', type: String })
  createReply(
    @Body() createCommentDto: CreateCommentDto,
    @Param('postId') postId: string,
    @Param('commentId') commentId: string,
    @RequestUser() user: User,
  ) {
    return this.commentsService.createReply(
      createCommentDto,
      user,
      postId,
      commentId,
    );
  }

  @Get()
  @ApiParam({ name: 'postId', type: String, description: '댓글 리스트 보기' })
  findAll(@Param('postId') postId: string, @Query('limit') limit: number = 10) {
    return this.commentsService.findCommentsByPostId(postId, limit);
  }

  @Patch(':commentId')
  @UseGuards(CommentRoleGuard)
  update(
    @Param('commentId') commentId: string,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    return this.commentsService.updateComment(commentId, updateCommentDto);
  }

  @Delete(':commentId')
  @UseGuards(CommentRoleGuard)
  @HttpCode(204)
  remove(@Param('commentId') commentId: string) {
    return this.commentsService.removeComment(commentId);
  }
}
