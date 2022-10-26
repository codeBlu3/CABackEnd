import { Field, ID, ObjectType } from "type-graphql";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  RelationId,
  Relation,
  ObjectIdColumn,
  ObjectID,
} from "typeorm";

//import { CAUser } from "./user";

@Entity()
@ObjectType()
export class Jobs{
  @Field((type) => ID)
  @ObjectIdColumn()
  readonly jobID: ObjectID;


//this should be params

  @Field((type) => [String])
  @Column("text", { array: true })
  filePaths: string[];

  @Field()
  @Column()
  userID: string;

  @Field()
  @Column()
  jobType: string;

  @Field()
  @Column()
  jobStatus: string;

}


/*
// this should be array
  @Field((type) => CAUser)
  @ManyToOne(() => CAUser, (causer) => causer.files)
  causer: Relation<CAUser>;



*/
