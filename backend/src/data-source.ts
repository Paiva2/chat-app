import "reflect-metadata"
import { DataSource } from "typeorm"
import { User } from "./api/database/entities/User.entity"
import "dotenv/config"

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
  entities: [User],
  migrations: ["./api/database/migrations/*.{ts}"],
  migrationsTableName: "migrations_table",
})
