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
import { Post } from '../entities/post.entity';

@Injectable()
export class PostRoleGuard implements CanActivate {
  constructor(
    @InjectRepository(Post) private postRepository: Repository<Post>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user as User;
    const postId = request.params.Id;

    const post = await this.postRepository.findOne({
      where: { id: postId },
      relations: ['user'],
    });

    if (!post) {
      throw new ForbiddenException('해당 게시글을 찾을 수 없습니다.');
    }

    return user.id === post.user.id || user.role === UserRole.ADMIN;
  }
}
