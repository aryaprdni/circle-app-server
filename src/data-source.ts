import "reflect-metadata";
import { DataSource } from "typeorm";

// export const AppDataSource = new DataSource({
//   type: "postgres",
//   host: "localhost",
//   port: 5432,
//   username: "postgres",
//   password: "root",
//   database: "threads-be",
//   synchronize: true,
//   logging: false,
//   entities: ["src/entities/*.ts"],
//   migrations: ["src/migrations/*.ts"],
//   subscribers: [],
// });

// with db vercel
// import "reflect-metadata";
// import { DataSource } from "typeorm";

// export const AppDataSource = new DataSource({
//   type: "postgres",
//   host: "ep-silent-glitter-a4bhwn46-pooler.us-east-1.aws.neon.tech",
//   port: 5432,
//   username: "default",
//   password: "u8MECFL3vAog",
//   database: "verceldb",
//   synchronize: true,
//   logging: false,
//   entities: ["src/entities/*.ts"],
//   migrations: ["src/migrations/*.ts"],
//   subscribers: [],
//   ssl: {
//     rejectUnauthorized: false
//   }
// });
// import "reflect-metadata";
// import { DataSource } from "typeorm";

// with db in railway
export const AppDataSource = new DataSource({
  type: "postgres",
  host: "monorail.proxy.rlwy.net",
  port: 43787,
  username: "postgres",
  password: "dscoqYzqkRIegveKwSSKLOZacPgBaxAK",
  database: "railway",
  synchronize: true,
  logging: false,
  entities: ["src/entities/*.ts"],
  migrations: ["src/migrations/*.ts"],
  subscribers: [],
});
