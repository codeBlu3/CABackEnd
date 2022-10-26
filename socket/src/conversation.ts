//import { Field, ID, ObjectType } from "type-graphql";
import {
  Entity,
  PrimaryGeneratedColumn,
  ObjectIdColumn,
  ObjectID,
  Column,
  OneToMany,
  ManyToOne,
  RelationId,
} from "typeorm";

//import { Image} from "./image"; // database design/ priority  / temporarily 1 to 1

//import {Store} from './store'
//import  {Image} from "./image";
//import  {Review} from "./review";

@Entity()
//@ObjectType()
export class Conversation {
  //  @Field(type => ID)
  @ObjectIdColumn()
  readonly conversationID: ObjectID; // read only?, what will happen //maps tot _id

  //  @Field(type => [String])
  @Column("text", { array: true })
  members: string[];

  //  @Field(type => [Message], {nullable: true})
  @Column((type) => Message)
  messages: Message[];
}

//@ObjectType()
export class Message {
  constructor(sender: string, text: string) {
    this.sender = sender;
    this.text = text;
  }

  //  @Field()
  @Column()
  sender: string;

  //  @Field()
  @Column()
  text: string;
}

/*
// only one to one connection is needed in here postgres == mongo
//RelationID is needed. to normalize column name
  @Field(type => Store)
  @ManyToOne(() => Store, store => store.recipes)
  store: Store;


  @Field(type => [Image])
  @OneToMany( () => Image, image => image.recipe, {cascade: true})
  images: Image[];

  @Field(type => [Review])
  @OneToMany( () => Review, review => review.recipe, {cascade: true})
  reviews: Review[];

*/
