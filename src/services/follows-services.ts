import { Repository } from "typeorm";
import { Follows } from "../entities/Follows";
import { AppDataSource } from "../data-source";
import { Request, Response } from "express";
import { User } from "../entities/User";

export default new (class FollowsService {
  private readonly FollowsRepository: Repository<Follows> = AppDataSource.getRepository(Follows);
  private readonly UserRepository: Repository<User> = AppDataSource.getRepository(User);

  async create(reqBody: any, userId: number): Promise<object | string> {
    try {
      const isFollowExist = await this.FollowsRepository.count({
        where: {
          follower: {
            id: userId,
          },
          following: {
            id: reqBody.followingUserId,
          },
        },
      });

      if (isFollowExist > 0) {
        throw new Error("You already follow this user");
      }

      if (reqBody.followingUserId === userId) {
        throw new Error("You can't follow yourself");
      }

      const isUserExist = await this.UserRepository.count({
        where: {
          id: reqBody.followerUserId,
        },
      });

      if (!isUserExist) {
        throw new Error("User doesn't exist");
      }

      const follow = this.FollowsRepository.create({
        follower: {
          id: userId,
        },
        following: {
          id: reqBody.followingUserId,
        },
      });

      const resFollow = await this.FollowsRepository.save(follow);
      return {
        message: "Follow created successfully",
        data: resFollow,
      };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async delete(followingUserId: number, userId: number): Promise<any> {
    try {
      const follow = await this.FollowsRepository.findOne({
        where: {
          follower: {
            id: userId,
          },
          following: {
            id: followingUserId,
          },
        },
      });

      if (!follow) {
        throw new Error("You didn't follow this user");
      }

      const response = await this.FollowsRepository.delete({ id: follow.id });

      return {
        message: "Follow deleted successfully",
        data: response,
      };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async find(userId: number, queryType?: string, queryLimit?: number): Promise<any> {
    try {
      let follows: Follows[];

      if (queryType === "followings") {
        follows = await this.FollowsRepository.find({
          take: queryLimit,
          where: {
            follower: {
              id: userId,
            },
          },
          relations: ["following"],
        });

        return follows.map((follow) => ({
          id: follow.id,
          userId: follow.following.id,
          username: follow.following.username,
          full_name: follow.following.full_name,
          email: follow.following.email,
          profile_picture: follow.following.profile_picture,
          profile_description: follow.following.profile_description,
          bio: follow.following.bio,
          is_following: true,
        }));
      } else if (queryType === "followers") {
        follows = await this.FollowsRepository.find({
          take: queryLimit,
          where: {
            following: {
              id: userId,
            },
          },
          relations: ["follower"],
        });

        return await Promise.all(
          follows.map(async (follow) => {
            const isFollowed = await this.FollowsRepository.count({
              where: {
                follower: {
                  id: userId,
                },
                following: {
                  id: follow.follower.id,
                },
              },
            });

            return {
              id: follow.id,
              userId: follow.follower.id,
              username: follow.follower.username,
              full_name: follow.follower.full_name,
              email: follow.follower.email,
              profile_picture: follow.follower.profile_picture,
              profile_description: follow.follower.profile_description,
              bio: follow.follower.bio,
              is_following: isFollowed > 0,
            };
          })
        );
      }

      return {
        message: `Please specify valid query "type" (followers / followings)`,
      };
    } catch (error) {
      throw new Error(error.message);
    }
  }
})();
