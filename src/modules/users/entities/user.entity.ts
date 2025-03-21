import { BaseEntity } from 'src/common/entities/base.entity';
import { Post } from 'src/modules/posts/entities/post.entity';
import { Comment } from 'src/modules/comments/entities/comment.entity';
import { Column, Entity, OneToMany } from 'typeorm';

export enum UserRole {
  ADMIN = 'admin',
  COMMON = 'common',
}

export enum RegisterType {
  COMMON = 'common',
  GOOGLE = 'google',
  KAKAO = 'kakao',
  NAVER = 'naver',
}

@Entity()
export class User extends BaseEntity {
  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  password: string;

  @Column({ nullable: true })
  socialId: string;

  @Column({ type: 'enum', enum: RegisterType, default: RegisterType.COMMON })
  registerType: RegisterType;

  @Column({ enum: UserRole, default: UserRole.COMMON })
  role: UserRole;

  @OneToMany(() => Post, (post) => post.user, {
    cascade: ['insert', 'soft-remove', 'recover'],
  })
  posts: Post[];

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];
}
