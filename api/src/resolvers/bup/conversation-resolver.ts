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

import {
  getRepository,
  Repository,
  getMongoRepository,
  MongoRepository,
} from "typeorm";
// add mongo reposittory

import { Conversation, Message } from "../models/conversation";

import { RecipeInput, ImageInput } from "./types/input";

//resolvers and queries on graphql should match
@Resolver((of) => Conversation)
export class ConversationResolver {
  constructor(
    private readonly conversationRepository: MongoRepository<Conversation>
  ) {
    //add connection name
    this.conversationRepository = getMongoRepository(Conversation, "dbMgCon");

    //const foodieRep  = getRepository(Foodie, 'dbPgCon')
  }

  @Query((returns) => Conversation, { nullable: true })
  async getConvoById(
    @Arg("conversationID", (type) => ID) conversationID: string
  ) {
    console.log(conversationID);
    let convo;
    try {
      convo = this.conversationRepository.findOne(conversationID);
    } catch (e) {
      console.log(e);
      convo = null;
    }
    return convo;
  }

  @Query((returns) => Conversation, { nullable: true })
  async getConvoByMembers(
    @Arg("conversationMembers", (type) => [String])
    conversationMembers: string[]
  ) {
    console.log(conversationMembers);
    console.log(typeof conversationMembers);
    let convo;
    try {
      convo = await this.conversationRepository.findOne({
        where: { members: { $all: conversationMembers } },
      });
      console.log(convo);
    } catch (e) {
      console.log(e);

      convo = null;
    }
    console.log(convo);
    return convo;
  }
  //

  @Query((returns) => [Conversation])
  async getAllConvoByUserId(@Arg("userID", (type) => String) userID: string) {
    let convoList;
    try {
      convoList = await this.conversationRepository.find({
        where: { members: userID },
      });
      console.log(convoList);
    } catch (e) {
      console.log(e);
      convoList = null;
    }
    return convoList;
  }

  @Query((returns) => [Conversation])
  async getAllConvo() {
    const convoList = await this.conversationRepository.find();
    console.log(convoList);
    return convoList;
  }

  @Mutation((returns) => Conversation)
  async addConvo(
    @Arg("conversationMembers", (type) => [String])
    conversationMembers: string[]
  ) {
    const newconvo = new Conversation();
    newconvo.members = conversationMembers;
    return await this.conversationRepository.save(newconvo);
  }

  @Mutation((returns) => Conversation)
  async findOrCreateConvoByMembers(
    @Arg("conversationMembers", (type) => [String])
    conversationMembers: string[]
  ) {
    console.log(conversationMembers);
    console.log(typeof conversationMembers);
    let convo;
    try {
      convo = await this.conversationRepository.findOne({
        where: { members: { $all: conversationMembers } },
      });
      if (!convo) {
        const newconvo = new Conversation();
        newconvo.members = conversationMembers;
        convo = await this.conversationRepository.save(newconvo);
      }
    } catch (e) {
      console.log(e);
    }
    return convo;
  }

  // new conversation?

  // Mutate  add message

  /*
this is a cross over  -- no, no user repository was queried in here

  @Query(returns => [Recipe])
  async getRecipes(): Promise<Recipe[]> {
    const res = await this.recipeRepository.find()
    console.log(res)
    return  res 
  }

  @Mutation(returns => Recipe)
  ddRecipe(@Arg("recipeInput") recipeInput: RecipeInput): Promise<Recipe> {
    const recipe = this.recipeRepository.create({
      ...recipeInput,
    })
    return this.recipeRepository.save(recipe)
  }

*/
}
