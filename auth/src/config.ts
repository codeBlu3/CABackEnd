// Config that is common to more than one part of the app.

import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";

// try importing models as a whole and unwrap all
import { CAUser} from "./user";
//import { Foodie } from "./foodie";

// env vars
//const env = process.env
//console.log(User)

export const typeOrmConfig: PostgresConnectionOptions = {
  name: "dbPgCon",
  type: "postgres",
  host: "pgdb",
  port: 5432,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  synchronize: false,
  logging: false,
  entities: [CAUser],
};
