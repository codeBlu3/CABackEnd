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
} from "type-graphql";
import { getRepository, Repository } from "typeorm";

//pg
import { Uploads } from "../models/uploads";
import { CAUser } from "../models/user";

//this should be userinfo database


//resolvers and queries on graphql should match
@Resolver((of) => Uploads)
export class UploadResolver {
  constructor(private readonly uploadsRepository: Repository<Uploads>) {
    this.uploadsRepository = getRepository(Uploads, "dbMgCon");
    //  this.userRepository = getRepository(CAUser, "dbPgCon");
  }

  @Query((returns) => [Uploads])
  async getAllUploads(){

      return this.uploadsRepository.find()
  }

  @Query((returns) => Uploads)
  async getFilesUploadedByUserID(
    @Arg("userID", (type) => ID) userID: string,
  ) {

      const upload = await this.uploadsRepository.findOne({
        where: { userID: { $eq: userID } },
      });
      return upload
 
  }

  @Mutation((returns) => Uploads)
  async attachFileUploadToUserID(
    @Arg("userID", (type) => ID) userID: string,
    @Arg("filepath") filepath: string
  ) {
    let upload;
    try {
      upload = await this.uploadsRepository.findOne({
        where: { userID: { $eq: userID } },
      });
      if (!upload) {
        const newupload = new Uploads();
        newupload.userID = userID;
        newupload.filePaths = [filepath];
        upload = await this.uploadsRepository.save(newupload);
        console.log(upload);
      } else {
        upload.filePaths = [...upload.filePaths, filepath];
        upload = await this.uploadsRepository.save(upload);

        console.log(upload);
      }
      return upload

    } catch (e) {
      console.log(e);
    }
  }
}

/*
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
  }


  @Mutation((returns) => File)
  addRecipe(@Arg("fileInput") fileInput: FileInput): Promise<File> {
    const file = this.fileRepository.create({
      ...fileInput,
    });
    return this.fileRepository.save(file);
  }


  @Mutation((returns) => Recipe)
  addRecipe(@Arg("recipeInput") recipeInput: RecipeInput): Promise<Recipe> {
    const recipe = this.recipeRepository.create({
      ...recipeInput,
    });
    return this.recipeRepository.save(recipe);
  }

  @Query((returns) => Recipe, { nullable: true })
  async getRecipeById(@Arg("recipeId", (type) => ID) recipeID: string) {
    //    console.log(recipeId)
    let recipe;
    try {
      recipe = this.recipeRepository.findOne(recipeID);
    } catch (e) {
      console.log(e);
      recipe = null;
    }
    return recipe;
  }

  // should be converted to array input this should be sorted by rating , type orm conputed field, recommender system's problem
  // to factor in, location
  // nearest location? // async map of id?  why not use the above function
  //how will the front end pass this?

  @Query((returns) => [Recipe])
  async getRecipes(): Promise<Recipe[]> {
    //to add

    const res = await this.recipeRepository.find();
    console.log(res);
    return res;
  }
  // Add mutation
  // double add
  //recipe init, no image
  // this could be add or edit recipe
  @Mutation((returns) => Recipe)
  async editRecipe(
    @Arg("recipeID", (type) => ID) recipeID: string,
    @Arg("recipeInput") recipeInput: RecipeInput
  ): Promise<Recipe> {
    const recipe: any = await this.recipeRepository.findOne(recipeID);
    recipe.recipeName = recipeInput.recipeName;
    recipe.recipeDescription = recipeInput.recipeDescription;
    recipe.recipePrice = recipeInput.recipePrice;
    return this.recipeRepository.save(recipe);
  }

  //error when images are null
  @Mutation((returns) => Recipe)
  async attachImageToRecipe(
    @Arg("recipeID", (type) => ID) recipeID: string,
    @Arg("imageArrayInput", (type) => [ImageInput!])
    imageArrayInput: ImageInput[]
  ) {
    const recipe: any = await this.recipeRepository.findOne(recipeID);
    const newImgArr = imageArrayInput.map((img) => new Image(img["imagePath"]));
    recipe.images = newImgArr;
    return this.recipeRepository.save(recipe);
  }
  */
