import { Field, ID, ObjectType } from "type-graphql";
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

import { Store } from "./store";
//import  {Image} from "./image";
import { Review } from "./review";

@Entity()
@ObjectType()
export class Recipe {
  @Field((type) => ID)
  @ObjectIdColumn()
  readonly recipeID: ObjectID; // read only?, what will happen //maps tot _id

  @Field()
  @Column()
  recipeFoodieID: string;

  @Field()
  @Column()
  recipeName: string;

  @Field()
  @Column({ type: "float" })
  recipePrice: number;

  @Field({ nullable: true })
  @Column({ nullable: true })
  recipeDescription?: string; //temporarily add ingredients here

  /*
  @Field(type => Store)
  @ManyToOne(() => Store, store => store.recipes)
  store: Store;
*/

  @Field((type) => [Image], { nullable: true })
  @Column((type) => Image)
  images: Image[];
}

@ObjectType()
export class Image {
  constructor(imagePath: string, imageDescription?: string) {
    this.imagePath = imagePath;
    this.imageDescription = imageDescription;
  }

  @Field()
  @Column()
  imagePath: string;

  @Field({ nullable: true })
  @Column({ nullable: true, default: "test" })
  imageDescription?: string;
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
