// must be at top
import "reflect-metadata";

// gql
import { ApolloServer } from "apollo-server";
import { buildSchema } from "type-graphql";

// db connection
//import { createConnection } from "typeorm"
import { createConnections, getRepository, getMongoRepository } from "typeorm";
import { pgConfig, mgConfig } from "./config";

//models
import { Uploads } from "./models/uploads";
import { CAUser } from "./models/user";

//resolvers
//import { RecipeResolver } from "./resolvers/recipe-resolver";
import { UploadResolver } from "./resolvers/user-resolver";
import { MLResolver} from "./resolvers/ml-resolver";

import axios from "axios"
//import fetch from "node-fetch"



// main
async function main() {
  try {

    const conns = await createConnections([pgConfig, mgConfig]);
    //const fileRep  = getRepository(File, 'dbPgCon')
    //console.log(fileRep)
    const schema = await buildSchema({
      resolvers: [UploadResolver, MLResolver],
    });
    //console.log(schema)

    const server = new ApolloServer({ schema });
    const { url } = await server.listen(7000);
    console.log(`Server has started!, on ${url}`);
  } catch (err) {
    console.error(err);
  }
}

main();

/*
import {Image} from  './models/image'
import {Review} from  './models/review'

    const recipeRep  = conn.getRepository(Recipe)
    const storeRep  = conn.getRepository(Store)
    const imageRep  = conn.getRepository(Image)



*/
//    const fid = '6138fbc53fa38f02aa1a720d'
//    const recipeRep  = getMongoRepository(Recipe,'dbMgCon')
//    const storeRep  = getRepository(Store, 'dbPgCon')
//    const res:any= await recipeRep.findOne(fid)
//const rest:any= await recipeRep.find()
//console.log(rest)

//console.log(res)

/*
    const newrecipe = new Recipe()
    newrecipe.recipeName = 'adobo'
    newrecipe.recipePrice = 25.1 
    newrecipe.recipeDescription= 'sdfsdfsdf' 
    newrecipe.images = [ 
      new Image('kervin_panot.jpeg', 'tesetset'),
      new Image('kervin_panot.jpeg', 'tesetset') 
    ]
    */
//    await recipeRep.save(res)

/*
 */

/*

//query item and add image
//attachedimage
*/

//    const syncres = await conn.synchronize()

/*
    const convoRep  = getMongoRepository(Conversation,'dbMgCon')
    console.log(convoRep)
    const convoList = await this.conversationRepository.find({select: ['conversationID']})
    const newconvo = new Conversation()
    await convoRep.save(newconvo)
    newconvo.members = ['491946d8-c936-4331-8962-0f2b21122953', 'e1541466-e1ba-44b3-bba5-0f272592abfb'] 
    newconvo.messages = [ 
      new Message('491946d8-c936-4331-8962-0f2b21122953', 'hello'),
    ]

    const rest:any= await convoRep.find()
    console.log(rest)

    const convoRep  = getMongoRepository(Conversation,'dbMgCon')
    const convoList = await convoRep.find({select: ['conversationID']})
    console.log(convoList)


*/
/*	
    const userRep  = getRepository(CAUser, 'dbPgCon')
    console.log(userRep) 
    const res = await userRep.find();
    console.log(res)

    let upload
    const fileRep  = getMongoRepository(Uploads,'dbMgCon')
    let userID =  "b1d531ff-33f2-4749-9a52-5369fbd5f50e"
    let filepath = "panotsijollibee.csv"  
    try {
      upload = await fileRep.findOne({where:{userID :{$eq:userID} }})  
      if (!upload) {
        const newupload = new Uploads()
	newupload.userID = userID 
	newupload.filePaths = [filepath]
	upload = await fileRep.save(newupload)
        console.log(upload)

      } else {
      upload.filePaths = [...upload.filePaths, filepath]
      upload = await fileRep.save(upload)

      console.log(upload)
       

      } 
    } 
    catch (e) {
      console.log(e)
    }

*/
/*
    console.log(fileRep)
    const res2 = await fileRep.find()
    console.log(res2)


*/

//    const res2 = await userRep.findOne("d0228dd7-0eff-43d5-afeb-1cb8a277e777");

//    console.log(res)
//   console.log(res2)
