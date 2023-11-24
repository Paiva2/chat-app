import { DataSource } from "typeorm"
import "reflect-metadata"
import "dotenv/config"
import { UserEntity } from "./api/database/entities/User.entity"
import { UserFriendEntity } from "./api/database/entities/UserFriend.entity"
import { ConnectionsEntity } from "./api/database/entities/Connections.entity"
import { MessageEntity } from "./api/database/entities/Message.entity"

// typeorm migration:generate -- MigrationName -d ./src/data-source.ts

export const TypeOrm = new DataSource({
  type: "postgres",
  host: "localhost",
  port: +process.env.DB_PORT!,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASS,
  database: process.env.POSTGRES_DB,
  synchronize: true,
  logging: false,
  entities: [UserEntity, UserFriendEntity, ConnectionsEntity, MessageEntity],
  migrations: ["./api/database/migrations/*.{ts}"],
  migrationsTableName: "migrations_table",
})
