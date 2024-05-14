import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, UpdateDateColumn, CreateDateColumn } from "typeorm";
import { Threads } from "./Threads";
import { User } from "./User";

@Entity({ name: "likes" })
export class Likes {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Threads, (threads) => threads.likes, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  })
  threads: Threads;

  @ManyToOne(() => User, (user) => user.likes, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  })
  user: User;

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
}
