import { Field, ID, ObjectType } from "type-graphql";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  RelationId,
} from "typeorm";

import { Recipe } from "./recipe";

@Entity()
@ObjectType()
export class Review {
  @Field((type) => ID)
  @PrimaryGeneratedColumn()
  readonly reviewID: number;

  //add restrictions, 1 - 10
  @Field()
  @Column()
  reviewDroolLevel: number;

  @Field({ nullable: true })
  @Column({ nullable: true })
  reviewComments: string;
  /*
  @Field(type => Recipe)
  @ManyToOne(() => Recipe, recipe => recipe.reviews)
  recipe: Recipe;
*/
}
