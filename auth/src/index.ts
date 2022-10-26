import "reflect-metadata";
import express from "express";
import cors from "cors";
import session from "express-session";
import passport from "passport";
//import { Strategy as BearerStrategy } from "passport-http-bearer";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcryptjs";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";

import { createConnection, getConnection, getRepository } from "typeorm";
import { typeOrmConfig } from "./config";
import {CAUser} from './user'
//import { Foodie } from "./foodie"; // 
// all response should be in json

// if single server, break this codebase, too monolithic
// try separate server, security wise, single server setup exposes user model. model should be 2 vies
// also, as microservices, it is not scalable and cost allocation will be difficult
// flow, authenticate, serialize, deserialize
const hname = process.env.SERVERHOSTNAME

async function main() {
  // should it be that try catch be here?
  //connection
  const conn = await createConnection(typeOrmConfig);
  const userRepository = getRepository(CAUser, "dbPgCon");

  // Middleware

  const app = express();

  app.use(express.json());
  app.use(cors({ origin: [`http://${hname}:19006`, `http://${hname}:8888`], credentials: true }));
  app.set("trust proxy", 1);

  app.use(session({ secret: "panotsijollibee" }));
  //passport init
  app.use(passport.initialize());
  app.use(passport.session());

  //passport serialize, deserialize
  passport.serializeUser(function (user: any, done) {
    console.log(`serializeuser ${user}`); //2
    done(null, user.userID); //deserialize?
  });

  passport.deserializeUser(async function (userID: any, cb) {
    console.log(`deserialize`);
    try {
      const quser: any = await userRepository.findOne(userID);
      console.log(`deserialize ${quser}`);
      if (quser) {
        //        cb(null, quser.userToken);
        cb(null, quser);
      } else {
        cb(null, false);
      }
    } catch (e) {
      console.log(e);
    }
  });
   //local auth
  app.post("/register", async (req, res) => {
    console.log('test')
  
    console.log(req)
    try {
      const quser = await userRepository.findOne({
        where: { username: req.body.username },
      });
      //      console.log(quser)

      if (quser) res.send("User Already Exists"); //backend response should be handled  //convert to json
      if (!quser) {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user = new CAUser();
        user.username = req.body.username;
        user.password = hashedPassword;
        await userRepository.save(user);
res.json({status: "User Created",});
      }
    } catch (e) {
res.json({status: "User was not Created",});
    }
  });

  passport.use(
    new LocalStrategy(async function (username, password: any, done) {
      try {
        const quser: any = await userRepository.findOne({
          where: { username: username },
        });
        if (!quser) return done(null, false); // to send user doesn't exist?  // security issue to eh
        if (bcrypt.compare(password, quser.password)) {
          //add uid token
          return done(null, quser); //2 user serialization
        } else {
          return done(null, false);
        }
      } catch (e) {
        console.log(e);
      }
    })
  );

  // for adding of oauthorize
  app.post("/login", passport.authenticate("local"), function (req:any, res) {
    // If this function gets called, authentication was successful.
    // `req.user` contains the authenticated user.
    // transfer data as json
//    res.send(req.user);
    res.json({
      loginStatus: "success",
      //      userToken:  req.user
//      userToken: req.user.userToken,
      userID: req.user.userID,
    });

  });

  app.get("/", (req, res) => {
    res.send("test");
  });

  app.get("/user", (req: any, res) => {
    //convert response  to uuid, token
    //only return user id and token, security issue
    //    console.log('user')
    //    console.log(req.user)
    //convert to json
    //res.send(req.user);
    console.log(req.user);
    res.json({
      message: "success!",
      //      userToken:  req.user
//      userToken: req.user.userToken,
      userID: req.user.userID,
    });
  });

  app.listen(process.env.PORT || 4000, () => {
    console.log("Server Started on port 4000");
  });
}

main();


/*
 //add bearer authentication
  passport.use(
    new BearerStrategy(async function (token: any, done) {
      console.log(`token ${token}`);
      try {
        const quser: any = await userRepository.findOne({
          where: { userToken: token },
        });
        //        console.log(`quser {quser}`)
        if (!quser) return done(null, false); // to send user doesn't exist?  // security issue to eh
        if (quser) {
          console.log(`strat ${quser}`);
          //add uid token
          return done(null, quser); //2 user serialization
        } else {
          return done(null, false);
        }
      } catch (e) {
        console.log(e);
      }
    })
  );

  app.get(
    "/auth/bearer",
    passport.authenticate("bearer", { session: false }),
    function (req, res) {
      console.log("bearer callback");
      //console.log(req)
      console.log(req.user);
      res.send(req.user);
    }
  );

*/



