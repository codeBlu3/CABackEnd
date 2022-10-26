import { Field, ID, ObjectType } from "type-graphql";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  RelationId,
} from "typeorm";

//import {Recipe} from './recipe'

@ObjectType()
@Entity()
export class Foodie {
  @Field((type) => ID)
  @PrimaryGeneratedColumn("uuid")
  readonly userID: number;

  @Field()
  @Column({ unique: true, nullable: true })
  username?: string;

  //if password null, stop register. should be done on auth strategy
  @Column({ nullable: true })
  password?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  googleId?: string;

  @Column({ nullable: true })
  userToken?: string;

  /*
  @Field(type => [String])
  @Column("simple-array")
  conversations?: string[];
*/
}
