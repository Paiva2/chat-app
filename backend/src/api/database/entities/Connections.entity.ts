import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm"
import { MessageEntity } from "./Message.entity"
import { UserEntity } from "./User.entity"

@Entity({ name: "connections" })
export class ConnectionsEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column("varchar", { length: 200 })
  connectionOne: string

  @Column("varchar", { length: 200 })
  connectionTwo: string

  @CreateDateColumn({ default: () => "NOW()" })
  createdAt: Date

  @CreateDateColumn({ default: () => "NOW()" })
  updatedAt: Date

  @Column("varchar", { nullable: false })
  fkUser: string

  @ManyToOne(() => UserEntity, (user) => user.id, {
    onDelete: "CASCADE",
    eager: false,
  })
  @JoinColumn({ name: "fkUser" })
  user: UserEntity

  @OneToMany(() => MessageEntity, (message) => message.fkConnections, {
    onDelete: "CASCADE",
  })
  messages: MessageEntity[]
}
