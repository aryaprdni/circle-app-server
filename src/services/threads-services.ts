import { Repository } from "typeorm";
import { Threads } from "../entities/Threads";
import { AppDataSource } from "../data-source";
import { Likes } from "../entities/Likes";

export default new (class ThreadsService {
  private readonly ThreadsRepository: Repository<Threads> = AppDataSource.getRepository(Threads);
  private readonly LikesRepository: Repository<Likes> = AppDataSource.getRepository(Likes);
  async create(data: any): Promise<object | string> {
    try {
      const response = await this.ThreadsRepository.save(data);
      return {
        message: "Create threads success",
        data: response,
      };
    } catch (error) {
      return {
        message: "Create threads failed",
        error: error.message,
      };
    }
  }

  async update(id: number, data: Threads): Promise<object | string> {
    try {
      const response = await this.ThreadsRepository.update(id, data);
      return {
        message: "Update threads success",
        data: response,
      };
    } catch (error) {
      return {
        message: "Update threads failed",
        error: error.message,
      };
    }
  }

  async delete(id: number): Promise<object | string> {
    try {
      const response = await this.ThreadsRepository.delete(id);
      return {
        message: "Delete threads success",
        data: response,
      };
    } catch (error) {
      return {
        message: "Delete threads failed",
        error: error.message,
      };
    }
  }

  async getAll(loginSession: any): Promise<object | string> {
    try {
      const thread = await this.ThreadsRepository.find({
        relations: ["replies", "likes", "user"],
        order: {
          id: "DESC",
        },
        select: {
          replies: true,
          likes: {
            id: true,
            user: {
              id: true,
            },
          },
          user: {
            id: true,
            username: true,
            full_name: true,
            profile_picture: true,
          },
        },
      });

      const userId = loginSession;
      const like = await this.LikesRepository.find({
        where: {
          user: {
            id: userId,
          },
        },
        relations: ["user", "threads"],
        select: {
          user: {
            id: true,
          },
          threads: {
            id: true,
          },
        },
      });

      return thread.map((data) => ({
        id: data.id,
        content: data.content,
        image: data.image,
        created_at: data.created_at,
        replies_count: data.replies.length,
        likes_count: data.likes.length,
        user: {
          id: data.user.id,
          username: data.user.username,
          full_name: data.user.full_name,
          profile_picture: data.user.profile_picture,
        },
        isLiked: like.some((likeData) => likeData.threads.id === data.id),
      }));
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getById(id: number, loginSession: any): Promise<object | string> {
    try {
      const response = await this.ThreadsRepository.findOne({
        where: { id },
        relations: ["replies", "likes", "user"],
        select: {
          replies: true,
          likes: true,
          user: {
            username: true,
            full_name: true,
            profile_picture: true,
          },
        },
      });

      const userId = loginSession;
      const like = await this.LikesRepository.find({
        where: {
          user: {
            id: userId,
          },
        },
        relations: ["user", "threads"],
        select: {
          user: {
            id: true,
          },
          threads: {
            id: true,
          },
        },
      });

      const result = {
        id: response.id,
        content: response.content,
        image: response.image,
        replies_count: response.replies.length,
        likes_count: response.likes.length,
        created_at: response.created_at,
        user: {
          id: response.user.id,
          username: response.user.username,
          full_name: response.user.full_name,
          profile_picture: response.user.profile_picture,
        },
        isLiked: like.some((likeData) => likeData.threads.id === response.id),
      };

      return result;
    } catch (error) {
      throw new Error(error.message);
    }
  }
})();
