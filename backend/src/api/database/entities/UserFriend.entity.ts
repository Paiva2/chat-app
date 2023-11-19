import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from "typeorm"
import { UserEntity } from "./User.entity"

@Entity({ name: "user_friend" })
export class UserFriendEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column("varchar", { length: 100 })
  username: string

  @Column("varchar", { length: 300 })
  profileImage: string

  @CreateDateColumn({ default: () => "NOW()" })
  addedAt: Date

  @ManyToOne(() => UserEntity, (user) => user.id)
  fkUser: UserEntity
}
