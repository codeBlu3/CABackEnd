// Config that is common to more than one part of the app.

import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";
import { Connection } from "typeorm";

import { Conversation } from "./conversation";

const mgModel = [Conversation];

export const mgConfig: any = {
  type: "mongodb",
  name: "dbMgCon",
  host: "mgdb",
  port: 27017,
  username: process.env.MONGO_INITDB_ROOT_USERNAME,
  password: process.env.MONGO_INITDB_ROOT_PASSWORD,
  database: process.env.MONGO_INITDB_DATABASE,
  synchronize: false,
  logging: false,
  entities: mgModel,
};
