import {jsonPlaceholderClient} from '@core/api';
import {BaseRepository} from './BaseRepository';
import {Post} from '../models';

export class JsonPlaceholderRepository extends BaseRepository {
  constructor() {
    super(jsonPlaceholderClient);
  }

  async getPosts(): Promise<Post[]> {
    return this.get<Post[]>('/posts');
  }

  async getPostById(id: number): Promise<Post> {
    return this.get<Post>(`/posts/${id}`);
  }
}
