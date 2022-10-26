// Config that is common to more than one part of the app.

import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";
import { Connection } from "typeorm";

//import { Foodie } from "./models/foodie";
//import { Store } from "./models/store";
//import { Recipe } from "./models/recipe";
//import { Conversation } from "./models/conversation";
//import  {Image} from "./models/image";
//import { Review } from "./models/review";
import { CAUser } from "./models/user";
import { Uploads } from "./models/uploads";
import { Jobs} from "./models/jobs";

const pgModel = [CAUser];

const mgModel = [Uploads, Jobs];

export const pgConfig: PostgresConnectionOptions = {
  type: "postgres",
  name: "dbPgCon",
  host: "pgdb",
  port: 5432,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  synchronize: true,
  logging: false,
  entities: pgModel,
};

export const mgConfig: any = {
  type: "mongodb",
  name: "dbMgCon",
  host: "mgdb",
  port: 27017,
  username: process.env.MONGO_INITDB_ROOT_USERNAME,
  password: process.env.MONGO_INITDB_ROOT_PASSWORD,
  database: process.env.MONGO_INITDB_DATABASE,
  synchronize: true,
  logging: false,
  entities: mgModel,
};
