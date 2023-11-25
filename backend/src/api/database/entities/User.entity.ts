import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  CreateDateColumn,
  OneToMany,
} from "typeorm"
import { UserFriendEntity } from "./UserFriend.entity"

@Entity({ name: "user" })
@Unique("my_unique_constraint", ["email"])
export class UserEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column("varchar", { length: 100 })
  username: string

  @Column("varchar", { length: 100 })
  email: string

  @Column("varchar", { length: 150 })
  password: string

  @Column("varchar", { length: 300 })
  profileImage: string

  @CreateDateColumn({ default: () => "NOW()" })
  createdAt: Date

  @CreateDateColumn({ default: () => "NOW()" })
  updatedAt: Date

  @OneToMany(() => UserFriendEntity, (friend) => friend.fkUser, {
    onDelete: "CASCADE",
  })
  friendList: UserFriendEntity[]
}
