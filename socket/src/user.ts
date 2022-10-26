//import { Field, ID, ObjectType } from "type-graphql";
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

@Entity()
//@ObjectType()
export class User {
  //  @Fiel(type => ID)
  @PrimaryGeneratedColumn()
  readonly userid: number;

  //  @Field()
  @Column({ unique: true })
  username: string;

  //  @Field()
  @Column({ nullable: true })
  password?: string;

  //  @Field({ nullable: true })
  @Column({ nullable: true })
  googleId?: string;

  //  @Field({ nullable: true })
  @Column({ nullable: true })
  userToken?: string;

  //  @Field({ nullable: true })
  @Column({ nullable: true })
  test?: string;

  /*
  @Field(type => [Rate])
  @OneToMany(type => Rate, rate => rate.recipe, { cascade: ["insert"] })
  ratings: Rate[];

  @Field(type => User)
  @ManyToOne(type => User)
  author: User;
  @RelationId((recipe: Recipe) => recipe.author)
  authorId: number;
  */
}
