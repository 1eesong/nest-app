import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  RemoveEvent,
} from 'typeorm';
import { Comment } from '../entities/comment.entity';
import { Post } from '../../posts/entities/post.entity';

@EventSubscriber()
export class CommentCountSubscriber
  implements EntitySubscriberInterface<Comment>
{
  listenTo() {
    return Comment;
  }

  async afterInsert(event: InsertEvent<Comment>) {
    const postRepository = event.manager.getRepository(Post);

    await postRepository.increment(
      { id: event.entity.post.id },
      'commentCount',
      1,
    );
  }

  async afterRemove(event: RemoveEvent<Comment>) {
    const postRepository = event.manager.getRepository(Post);

    await postRepository.decrement(
      { id: event.databaseEntity.post.id },
      'commentCount',
      1 + (event.entity?.replies.length || 0),
    );
  }
}
