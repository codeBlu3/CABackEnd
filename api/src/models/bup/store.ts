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

// retain this, should be one isto 1
// and have this Store have a one to Many with reciep

@ObjectType()
@Entity()
export class Store {
  @Field((type) => ID)
  @PrimaryGeneratedColumn()
  readonly storeID: number;

  @Field()
  @Column({ unique: true })
  storeName: string;

  //location
  @Field({ nullable: true })
  @Column({ nullable: true })
  storeLocation?: string;

  // cross connection? is not possible, cross join, resolver level, false relation
  /*
  @Field(type => [Recipe])
  @OneToMany( () => Recipe, recipe => recipe.store, {cascade : true})
  recipes: Recipe[];
*/
}
