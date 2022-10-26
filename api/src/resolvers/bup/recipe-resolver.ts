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

import { Recipe, Image } from "../models/recipe";
import { Review } from "../models/review";

//pg
import { Foodie } from "../models/foodie";

import { RecipeInput, ImageInput } from "./types/input";

//resolvers and queries on graphql should match
@Resolver((of) => Recipe)
export class RecipeResolver {
  constructor(
    private readonly recipeRepository: Repository<Recipe>,
    private readonly reviewRepository: Repository<Review> //     private readonly foodieRepository: Repository<Foodie>
  ) {
    //add connection name
    this.recipeRepository = getRepository(Recipe, "dbMgCon");
    this.reviewRepository = getRepository(Review, "dbMgCon");
    //    this.foodieRepository = getRepository(Foodie, 'dbPgCon')

    //const foodieRep  = getRepository(Foodie, 'dbPgCon')
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
}
