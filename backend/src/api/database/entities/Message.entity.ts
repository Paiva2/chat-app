import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm"
import { ConnectionsEntity } from "./Connections.entity"

@Entity({ name: "message" })
export class MessageEntity {
  @PrimaryGeneratedColumn("uuid")
  messageId: string

  @Column("varchar", { length: 500 })
  message: string

  @Column("varchar", { length: 200 })
  sendToId: string

  @Column("varchar", { length: 100 })
  sendToUsername: string

  @Column("varchar", { length: 100 })
  time: string

  @Column("varchar", { length: 100 })
  type: string

  @Column("varchar", { length: 100 })
  userId: string

  @Column("varchar", {
    length: 200,
  })
  userProfilePic: string

  @Column("varchar", { length: 200 })
  username: string

  @CreateDateColumn({ default: () => "NOW()" })
  createdAt: Date

  @Column("varchar", { nullable: false })
  fkConnections: string

  @ManyToOne(() => ConnectionsEntity, (connection) => connection.id, {
    onDelete: "CASCADE",
    eager: false,
  })
  @JoinColumn({ name: "fkConnections" })
  user: ConnectionsEntity
}
