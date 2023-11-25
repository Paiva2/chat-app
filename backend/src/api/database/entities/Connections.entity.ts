import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm"
import { MessageEntity } from "./Message.entity"

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

  @OneToMany(() => MessageEntity, (message) => message.fkConnections, {
    onDelete: "CASCADE",
  })
  messages: MessageEntity[]
}
