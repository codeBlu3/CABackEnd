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

import { CAUser } from "./user";

@Entity()
@ObjectType()
export class Uploads {
  @Field((type) => ID)
  @ObjectIdColumn()
  readonly uploadID: ObjectID;

  @Field((type) => [String])
  @Column("text", { array: true })
  filePaths: string[];

  @Field()
  @Column()
  userID: string;
}

/*
// this should be array
  @Field((type) => CAUser)
  @ManyToOne(() => CAUser, (causer) => causer.files)
  causer: Relation<CAUser>;



*/
