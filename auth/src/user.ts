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
export class CAUser {
  @PrimaryGeneratedColumn('uuid')
  readonly userID: number;

  //  @Field()
  @Column({ unique: true })
  username: string;

  //  @Field()
  @Column()
  password: string;

  //@Column({ unique:true})
  //userToken: string;

}
  /*
  @Field(type => [Rate])
  @OneToMany(type => Rate, rate => rate.recipe, { cascade: ["insert"] })
  ratings: Rate[];

  @Field(type => User)
  @ManyToOne(type => User)
  author: User;
  @RelationId((recipe: Recipe) => recipe.author)
  authorId: number;

  //  @Field({ nullable: true })
  @Column({ nullable: true })
  googleId?: string;

  //  @Field({ nullable: true })
  @Column({ nullable: true })
  userToken?: string;

  //  @Field({ nullable: true })
  @Column({ nullable: true })
  test?: string;


@Entity()
export class Foodie{
  @PrimaryGeneratedColumn('uuid')
  readonly userID: number;

  @Column({unique: true, nullable: true})
  username?: string;

//if password null, stop register. should be done on auth strategy
  @Column({ nullable: true })
  password?: string;

  @Column({ nullable: true })
  googleId?: string;


  @Column({ nullable: true , unique:true})
  userToken?: string;

}
  */
