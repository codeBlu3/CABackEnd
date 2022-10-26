import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  RelationId,
} from "typeorm";

@Entity()
export class Conversation {
  @PrimaryGeneratedColumn("uuid")
  readonly convsersationID: string;

  @Column({ unique: true, nullable: true })
  username?: string;

  //if password null, stop register. should be done on auth strategy
  @Column({ nullable: true })
  password?: string;

  @Column({ nullable: true })
  googleId?: string;

  @Column({ nullable: true, unique: true })
  userToken?: string;
}
