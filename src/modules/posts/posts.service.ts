import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { Post } from './entities/post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOperator, FindOptionsWhere, ILike, Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import {
  ListAllPostDto,
  OrderByOption,
  OrderOption,
} from './dto/list-all-post.dto';
import { PostView } from './entities/post-view.entity';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post) private postRepository: Repository<Post>,
    @InjectRepository(PostView)
    private postViewRepository: Repository<PostView>,
  ) {}

  async createPost(createPostDto: CreatePostDto, user: User) {
    const post = this.postRepository.create({ ...createPostDto, user });
    await this.postRepository.save(post);
    return post;
  }

  async findAll(options: ListAllPostDto) {
    // const whereCondition: FindOptionsWhere<Post>[] = [];
    // if (options.title) {
    //   whereCondition.push({ title: ILike(`%${options.title}%`) });
    // }
    // if (options.content) {
    //   whereCondition.push({ content: ILike(`%${options.content}%`) });
    // }
    // const [data, total] = await this.postRepository.findAndCount({
    //   relations: ['user'],
    //   where: whereCondition.length ? whereCondition : {},
    //   take: options.limit,
    //   skip: options.limit * (options.page - 1),
    //   select: {
    //     user: {
    //       id: true,
    //       name: true,
    //     },
    //   },
    // });
    const queryBuilder = this.postRepository
      .createQueryBuilder('p')
      .take(options.limit)
      .skip(options.limit * (options.page - 1))
      .orderBy('p.createdAt', 'DESC')
      .innerJoin('p.user', 'u')
      .select([
        'p.id',
        'p.title',
        'p.createdAt',
        'p.thumbnailUrl',
        'p.views',
        'u.id',
        'u.name',
      ]);

    if (options.title) {
      queryBuilder.andWhere('p.title LIKE :title', {
        title: `%${options.title}%`,
      });
    }

    if (options.content) {
      queryBuilder.andWhere('p.content LIKE :content', {
        cotent: `%${options.content}%`,
      });
    }

    if (
      options.orderBy &&
      [OrderByOption.VIEWS, OrderByOption.CREATED_AT].includes(options.orderBy)
    ) {
      queryBuilder.orderBy(`p.${options.orderBy}`, options.order);
    }

    const [data, total] = await queryBuilder.getManyAndCount();

    return {
      data,
      total,
      page: options.page,
      limit: options.limit,
      totalPages: Math.ceil(total / options.limit),
    };
  }

  async findOne(id: string, user: User) {
    const data = await this.postRepository.findOne({ where: { id } });
    if (data) {
      const checkPostView = await this.postViewRepository.findOne({
        where: { user: { id: user.id }, post: { id: data.id } },
        order: { createdAt: OrderOption.DESC },
      });

      if (checkPostView) {
        if (Date.now() - checkPostView.createdAt.getTime() <= 60 * 10 * 1000) {
          return {
            data,
          };
        }
      }

      // 10분이 넘어가면 조회수 올리도록
      // const postView = this.postViewRepository.create({
      //   post: data,
      //   user,
      // });
      // await this.postViewRepository.save(postView);
      // const postViewCount = await this.postViewRepository.count({
      //   where: { post: { id: data.id } },
      // });
      // 조회수 올리는 로직
      //   data.views = postViewCount;
      //   await this.postRepository.save(data);
    }
    return {
      data,
    };
  }

  async findPostById(id: string) {
    return await this.postRepository.findOne({ where: { id } });
  }

  async updatePost(id: string, updatePostDto: UpdatePostDto) {
    const result = await this.postRepository.update(id, {
      content: updatePostDto.content,
    });

    if (result.affected === 0) {
      throw new NotFoundException('해당하는 게시글이 없습니다.');
    }
    return result;
  }

  async removePost(id: string) {
    const post = await this.postRepository.findOne({ where: { id } });

    if (!post) {
      throw new NotFoundException('해당하는 게시글이 없습니다.');
    }

    const result = await this.postRepository.remove(post);

    return { message: '게시글이 삭제되었습니다.', result };
  }
}
