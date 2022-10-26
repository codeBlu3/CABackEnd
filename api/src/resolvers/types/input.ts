import { InputType, Field } from "type-graphql";

//import { Recipe, Image } from "../../models/recipe";
import { File } from "../../models/file";
import { CAUser } from "../../models/user";

@InputType()
export class FileInput implements Partial<File> {
  @Field()
  filePath: string;

  @Field((type) => CAUser)
  causer: CAUser;
}
/*
export class RecipeInput implements Partial<Recipe> {
  @Field()
  recipeFoodieID: string;

  @Field()
  recipeName: string;

  @Field({ nullable: true })
  recipeDescription: string;

  @Field()
  recipePrice: number;
}

@InputType()
export class ImageInput implements Partial<Image> {
  @Field()
  imagePath: string;

  @Field({ nullable: true })
  imageDescription: string;
  }

@Entity()
@ObjectType()
export class File{
  @Field((type) => ID)
  @PrimaryGeneratedColumn()
  readonly fileID: number;

  @Field()
  @Column()
  filePath: string;

  @Field((type) => CAUser)
  @ManyToOne(() => CAUser, (causer) => causer.files)
  causer: CAUser;



*/
