import { Repository } from "typeorm";
import { Likes } from "../entities/Likes";
import { AppDataSource } from "../data-source";

export default new (class LikesService {
  private readonly LikesRepository: Repository<Likes> = AppDataSource.getRepository(Likes);

  async create(reqBody: any, loginSession: any): Promise<any> {
    try {
      const isLikeExist = await this.LikesRepository.count({
        where: {
          user: {
            id: loginSession,
          },
          threads: {
            id: reqBody.threadsId,
          },
        },
      });

      if (isLikeExist > 0) {
        throw new Error("You already like this thread!");
      }

      const like = this.LikesRepository.create({
        threads: {
          id: reqBody.threadsId,
        },
        user: {
          id: loginSession,
        },
      });

      await this.LikesRepository.save(like);

      return {
        message: "You liked this thread!",
        like: like,
      };
    } catch (error) {
      return {
        message: "Create likes failed",
        error: error.message,
      };
    }
  }

  async delete(id: number, userId: number): Promise<object | string> {
    try {
      const checkLike = await this.LikesRepository.findOne({
        relations: ["user", "threads"],
        where: {
          user: {
            id: userId,
          },
          threads: {
            id: id,
          },
        },
      });
      if (!checkLike) {
        throw new Error("You didn't like this thread");
      }

      const response = this.LikesRepository.delete({
        id: checkLike.id,
      });

      return {
        message: "You disliked this thread!",
        data: response,
      };
    } catch (error) {
      console.log(error)
      return {
        message: "Delete likes failed",
        error: error.message,
      };
    }
  }

  async getAll(): Promise<object | string> {
    try {
      const response = await this.LikesRepository.find();
      return {
        message: "Get all likes success",
        data: response,
      };
    } catch (error) {
      return {
        message: "Get all likes failed",
        error: error.message,
      };
    }
  }

  async getById(id: number): Promise<object | string> {
    try {
      const response = await this.LikesRepository.findOneBy({ id });
      return {
        message: "Get one likes success",
        data: response,
      };
    } catch (error) {
      return {
        message: "Get one likes failed",
        error: error.message,
      };
    }
  }
})();
