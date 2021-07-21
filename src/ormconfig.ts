// ormconfig with postgresql
import { ConnectionOptions } from "typeorm";

export default {
  type: "mongodb",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_DATABASE || "type-express",
  synchronize: true,
  logging: false,
  // autoReconnect: true,
  // reconnectTries: Number.MAX_VALUE,
  // reconnectInterval: 2000,
  useUnifiedTopology: true,
  entities: [
    "src/entity/**/*.ts"
  ],
  migrations: [
    "src/migration/**/*.ts"
  ],
  cli: {
    "entitiesDir": "src/entity",
    "migrationsDir": "src/migration",
  },
} as ConnectionOptions;