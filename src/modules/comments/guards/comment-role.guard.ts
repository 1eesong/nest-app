import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserRole } from 'src/modules/users/entities/user.entity';
import { Repository } from 'typeorm';
import { Request } from 'express';
import { Comment } from '../entities/comment.entity';

@Injectable()
export class CommentRoleGuard implements CanActivate {
  constructor(
    @InjectRepository(Comment) private commentRepository: Repository<Comment>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user as User;
    const commentId = request.params.commentId;

    const comment = await this.commentRepository.findOne({
      where: { id: commentId },
      relations: ['user'],
    });

    if (!comment) {
      throw new ForbiddenException('해당 댓글을 찾을 수 없습니다.');
    }

    return user.id === comment.user.id || user.role === UserRole.ADMIN;
  }
}
