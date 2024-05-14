import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Threads } from "./Threads";
import { Replies } from "./Replies";
import { Likes } from "./Likes";
import { Follows } from "./Follows";

@Entity({ name: "users" })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  full_name: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  password: string;

  @Column({ nullable: true })
  bio: string;

  @Column({ nullable: true })
  profile_picture: string;

  @Column({ nullable: true })
  profile_description: string;

  @OneToMany(() => Threads, (thread) => thread.user, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  })
  threads: Threads[];

  @OneToMany(() => Replies, (replies) => replies.user, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  })
  replies: Replies[];

  @OneToMany(() => Likes, (likes) => likes.user, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  })
  likes: Likes[];

  @OneToMany(() => Follows, (follows) => follows.follower, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  })
  following: Follows[];

  @OneToMany(() => Follows, (follows) => follows.following, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  })
  follower: Follows[];
}
