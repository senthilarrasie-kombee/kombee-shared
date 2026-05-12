import {JsonPlaceholderRepository} from '../repositories/JsonPlaceholderRepository';
import {Post} from '../models';

export class JsonPlaceholderService {
  private repository: JsonPlaceholderRepository;

  constructor() {
    this.repository = new JsonPlaceholderRepository();
  }

  async fetchPosts(): Promise<Post[]> {
    try {
      return await this.repository.getPosts();
    } catch (error) {
      console.error('[JsonPlaceholderService] Error fetching posts:', error);
      throw error;
    }
  }

  async fetchPostById(id: number): Promise<Post> {
    try {
      return await this.repository.getPostById(id);
    } catch (error) {
      console.error(`[JsonPlaceholderService] Error fetching post ${id}:`, error);
      throw error;
    }
  }
}
