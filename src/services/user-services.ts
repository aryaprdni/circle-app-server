import { Like, Repository } from "typeorm";
import { User } from "../entities/User";
import { AppDataSource } from "../data-source";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { Response } from "express";
import { Follows } from "../entities/Follows";

export default new (class UserServices {
  private readonly UserRepository: Repository<User> = AppDataSource.getRepository(User);
  private readonly FollowingRepository: Repository<Follows> = AppDataSource.getRepository(Follows);

  async Register(data: any, res: Response): Promise<object | string> {
    try {
      const checkEmail = await this.UserRepository.exists({
        where: {
          email: data.email,
        },
      });
      if (checkEmail)
        return res.status(409).json({
          message: `message: email ${data.email} already exist`,
        });

      const checkUsername = await this.UserRepository.exists({
        where: {
          username: data.username,
        },
      });
      if (checkUsername)
        return res.status(409).json({
          message: `message: username ${data.username} already exist`,
        });

      const hashPassword = await bcrypt.hash(data.password, 10);

      const obj = {
        ...data,
        password: hashPassword,
      };

      const response = await this.UserRepository.save(obj);
      return {
        message: "Register success",
        data: response,
      };
    } catch (error) {
      return {
        message: "Register failed",
        error: error.message,
      };
    }
  }

  async Login(data: any, res: Response): Promise<object | string> {
    try {
      const checkUser = await this.UserRepository.findOne({
        where: [{ username: Like(`%${data.username}%`) }, { email: Like(`%${data.username}%`) }],
        relations: ["follower", "following"],
      });

      if (!checkUser) {
        throw new Error("Email / password is wrong!");
      }

      const comparePassword = await bcrypt.compare(data.password, checkUser.password);
      if (!comparePassword) {
        return res.status(400).json({
          message: "Email/username and password is wrong!",
        });
      }

      const obj = {
        id: checkUser.id,
        username: checkUser.username,
      };

      const token = jwt.sign(obj, "secret", { expiresIn: "1h" });

      return {
        message: "Login success",
        token: token,
        user: {
          id: checkUser.id,
          username: checkUser.username,
          full_name: checkUser.full_name,
          email: checkUser.email,
          profile_picture: checkUser.profile_picture,
          profile_description: checkUser.profile_description,
          bio: checkUser.bio,
          followers_count: checkUser.follower.length,
          followings_count: checkUser.following.length,
        },
      };
    } catch (error) {
      console.error("Error occurred during login:", error);

      return {
        message: "Login failed",
        error: error.message,
      };
    }
  }

  async Update(data: any, res: Response): Promise<object | string> {
    try {
      const user = await this.UserRepository.findOne({
        where: {
          id: data.id,
        },
      });

      if (!user) {
        return res.status(404).json({
          message: `User with ID ${data.id} not found`,
        });
      }

      if (data.username && data.username !== user.username) {
        const existingUser = await this.UserRepository.findOne({
          where: {
            username: data.username,
          },
        });

        if (existingUser) {
          return res.status(409).json({
            message: `Username ${data.username} is already taken`,
          });
        }

        user.username = data.username;
      }

      if (data.full_name) {
        user.full_name = data.full_name;
      }
      if (data.bio) {
        user.bio = data.bio;
      }
      if (data.email) {
        user.email = data.email;
      }
      if (data.profile_picture !== null) {
        user.profile_picture = data.profile_picture;
      }
      if (data.profile_description !== null) {
        user.profile_description = data.profile_description;
      }

      const response = await this.UserRepository.save(user);
      return {
        message: "Updated success",
        data: response,
      };
    } catch (error) {
      return {
        message: "Updated failed",
        error: error.message,
      };
    }
  }

  async getAll(loginSession: number): Promise<object | string> {
    try {
      const allUsers = await this.UserRepository.find();
      const userId = loginSession;
      return await Promise.all(
        allUsers.map(async (data) => {
          const isFollowed = await this.FollowingRepository.count({
            where: {
              follower: {
                id: userId,
              },
              following: {
                id: data.id,
              },
            },
          });

          return {
            id: data.id,
            username: data.username,
            full_name: data.full_name,
            email: data.email,
            profile_picture: data.profile_picture,
            bio: data.bio,
            userId: data.id,
            is_following: isFollowed > 0,
          };
        })
      );
    } catch (error) {
      return {
        message: "Get all user failed",
        error: error.message,
      };
    }
  }

  async getOne(id: number): Promise<object | string> {
    try {
      const response = await this.UserRepository.findOne({
        where: {
          id: id,
        },
      });

      return {
        message: "Get one user success",
        data: response,
      };
    } catch (error) {
      return {
        message: "Get one user failed",
        error: error.message,
      };
    }
  }

  async check(loginSession: any): Promise<any> {
    try {
      const user = await this.UserRepository.findOne({
        relations: ["follower", "following"],
        where: {
          id: loginSession,
        },
      });

      return {
        message: "Token is valid!",
        user: {
          id: user.id,
          full_name: user.full_name,
          username: user.username,
          email: user.email,
          bio: user.bio,
          profile_picture: user.profile_picture,
          profile_description: user.profile_description,
          followers_count: user.follower.length,
          followings_count: user.following.length,
        },
      };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // Di service
async updateBackground(data: any, res: Response) {
  try {
    console.log(data);
    const user = await this.UserRepository.findOne({
      where: {
        id: data.id,
      },
    });

    if (!user) {
      return res.status(404).json({
        message: `User with ID ${data.id} not found`,
      });
    }

    if (data.profile_description !== null) {
      user.profile_description = data.profile_description;
    }
    

    const response = await this.UserRepository.save(user);
    return {
      message: "Updated success",
      data: response,
    };
  } catch (error) {
    throw new Error(error.message);
  }
}

})();
