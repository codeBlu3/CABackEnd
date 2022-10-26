import {
  Resolver,
  Query,
  FieldResolver,
  Arg,
  Root,
  Mutation,
  Ctx,
  Int,
  ID,
  ObjectType,
  Field,
  Float

} from "type-graphql";
import { getRepository, Repository } from "typeorm";
import axios from "axios"

import { Jobs } from "../models/jobs";
//import fetch from "node-fetch"

//const FASTAPI_URL = 'http://fastapi:8000'; // this should be  env variable
const FASTAPI_URL = 'http://fastapi:8000'; // this should be  env variable, docker compose doesn't respect port mapping from inside


//resolvers and queries on graphql should match

@ObjectType()
class matchesData{
  @Field(type => Float)
  Kdistance: number 

  @Field()
  DatabaseData: string

  
  @Field()
  QueryData: string
  


}

@Resolver()
export class MLResolver {
  constructor(private readonly jobsRepository: Repository<Jobs>) {
    this.jobsRepository = getRepository(Jobs, "dbMgCon");
  }

  @Query(() => [String])
  async getHeadersbyFileName(
    @Arg("filename") filename: string
  ){
    const  HeadersUrl=  `${FASTAPI_URL}/headersbyfilename` //convert to fastapi
    const jsonbody = JSON.stringify({ filename: filename});
    const  response:any = await axios.post(HeadersUrl, jsonbody );
      return  response.data.headerColumns
  }


  @Mutation((type) => Jobs)
  async startDedupeJob(
    @Arg("userID", (type) => ID) userID: string,
    @Arg("filename") filename: string,
    @Arg("headerselected", type => [String]) headerselected: string[],
  ){
        const newjob = new Jobs();
        newjob.userID = userID;
        newjob.filePaths = [filename];
        newjob.jobType = 'dedupe'
        const job = await this.jobsRepository.save(newjob);
 
       const jobID = job.jobID 
       console.log(jobID)
    const destHeader: any = headerselected.map(function (curElem: any) {
        let elem: any = {};
        elem[curElem] = true;
        return elem;
      });

    const  jobUrl=  `${FASTAPI_URL}/headersselected`
    const jsonbody = JSON.stringify([...destHeader, {jobID: jobID},  { dpfilename: filename}]);
    axios.post(jobUrl, jsonbody );

      return job 
  }


  @Query((type) => [Jobs])
  async getJobsByUserID(
    @Arg("userID", (type) => ID) userID: string,
  ){
      return await this.jobsRepository.find({
        where: { userID: { $eq: userID } },
      })

    }


  @Query(()=> [matchesData])
  async getMatchesDataByJobID(
    @Arg("jobID", (type) => ID) jobID: string,
  ){
    const  matchesUrl=  `${FASTAPI_URL}/dfmatches`
    const jsonbody = JSON.stringify({jobID:jobID});
    const dfdata = await axios.post(matchesUrl, jsonbody );
    const matchesDataArray =  JSON.parse(dfdata.data)
    return  matchesDataArray

  }



  @Mutation((type) => String)
  async mergeKdistanceToOrig(
    @Arg("jobID", (type) => ID) jobID: string,
    @Arg("kdistance", (type) => Float) kdistance: number,
  ){

    const  mergeUrl=  `${FASTAPI_URL}/kdistanceselection`
    const jsonbody = JSON.stringify({jobID, kdistance});
    const mergestat = await axios.post(mergeUrl, jsonbody );

    return mergestat.data.status
  }

   @Query(() => String)
  async hello(){

      return  "World"
  }

}

/*
 let arrtest = ["a", "b", "c"]
  const testheader = arrtest.map( (curelem) => {
        let elem:any = {}
        elem[curelem] =true
        return elem;
  }

  )  
  console.log(testheader)

let arrtest = ["a", "b", "c"]
  const testheader = arrtest.map( (curelem) =>  ( {[curelem]: true}))  
  console.log(testheader)


  async function asRequestHeaders()  {
    let response = await fetch(csvHeadersUrl);
    let result = await response.json();
    let headerCol= await result.headerColumns
    let headerSt = headerCol.sort().map( 
      function (currentElem: any)  {
      const hstat = {
        headerName: currentElem,
	isChecked: false
      } 
      return hstat
      } 
    )

    setHeaderStats(headerSt)
  }

//kailangan pa ba ng input to? file path lang eh
 @Mutation((returns) => CAUser)
  async attachFileToUser(
    @Arg("userID", (type) => ID) userID: string,
    @Arg("imageArrayInput", (type) => [ImageInput!])
    imageArrayInput: ImageInput[]
  ) {
    const recipe: any = await this.recipeRepository.findOne(recipeID);
    const newImgArr = imageArrayInput.map((img) => new Image(img["imagePath"]));
    recipe.images = newImgArr;
    return this.recipeRepository.save(recipe);

   @Query(() => String)
  async hello(){

      return  "World"
  }


  @Query(() => [String])
  async testAccessFast(){

    const  csvHeadersUrl=  `${FASTAPI_URL}/dfCsvHeaders` //convert to fastapi
    const  response:any = await axios.get(csvHeadersUrl);
    //const data = JSON.parse(response.data)
    console.log(response.data.headerColumns)
    //console.log(response.data)
    //let response = await axios.get('https:google.com');
    //console.log(response)
    //console.log('aw')
      return  response.data.headerColumns
  }

 }
*/
