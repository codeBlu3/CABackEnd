import { Field, ID, ObjectType } from "type-graphql";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  RelationId,
} from "typeorm";

//import { Image} from "./image"; // database design/ priority  / temporarily 1 to 1
//import { User } from "./user";

import { Store } from "./store";
import { Image } from "./image";
import { Review } from "./review";

@Entity()
@ObjectType()
export class Recipe {
  @Field((type) => ID)
  @PrimaryGeneratedColumn()
  readonly recipeID: number;

  @Field()
  @Column()
  recipeName: string;

  @Field()
  @Column({ type: "float" })
  recipePrice: number;

  @Field({ nullable: true })
  @Column({ nullable: true })
  recipeDescription?: string; //temporarily add ingredients here

  //RelationID is needed. to normalize column name
  @Field((type) => Store)
  @ManyToOne(() => Store, (store) => store.recipes)
  store: Store;

  @Field((type) => [Image])
  @OneToMany(() => Image, (image) => image.recipe, { cascade: true })
  images: Image[];

  @Field((type) => [Review])
  @OneToMany(() => Review, (review) => review.recipe, { cascade: true })
  reviews: Review[];
}
