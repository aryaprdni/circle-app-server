import { CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";

@Entity({ name: "follows" })
export class Follows {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
  })
  created_at: Date;

  @CreateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
    onUpdate: "CURRENT_TIMESTAMP",
  })
  updated_at: Date;

  @ManyToOne(() => User, (user) => user.following, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  following: User;

  @ManyToOne(() => User, (user) => user.follower, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  follower: User;
}
