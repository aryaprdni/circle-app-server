import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { User } from "./User";
import { Likes } from "./Likes";
import { Replies } from "./Replies";

@Entity({ name: "threads" })
export class Threads {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  content: string;

  @Column({ nullable: true })
  image: string;

  @CreateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
  })
  created_at: Date;

  @UpdateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
    onUpdate: "CURRENT_TIMESTAMP",
  })
  updated_at: Date;

  @ManyToOne(() => User, (user) => user.threads, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  })
  user: User;

  @OneToMany(() => Likes, (likes) => likes.threads, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  })
  likes: Likes[];

  @OneToMany(() => Replies, (replies) => replies.threads, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  })
  replies: Replies[];
}

