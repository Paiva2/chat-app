import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
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

  @Column("boolean")
  auth: boolean

  @CreateDateColumn({ default: () => "NOW()" })
  addedAt: Date

  @Column("varchar", { nullable: false })
  fkUser: string

  @ManyToOne(() => UserEntity, (user) => user.id, {
    onDelete: "CASCADE",
    eager: false,
  })
  @JoinColumn({ name: "fkUser" })
  user: UserEntity
}
