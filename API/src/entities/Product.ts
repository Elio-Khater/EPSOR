import { ObjectType, Field, ID, Float, Int } from "type-graphql";
import { Entity, BaseEntity, ObjectIdColumn, Column } from "typeorm";
import { ObjectID } from "mongodb";
@ObjectType() //1
@Entity() //2
export class Product extends BaseEntity {
  //3
  @Field(() => ID) //4
  @ObjectIdColumn() //5
  id: ObjectID;
  @Field()
  @Column() //6
  productName: string;
  @Field()
  @Column()
  description: string;
  @Field(() => Float)
  @Column()
  price: number;
  @Field(() => Int)
  @Column()
  numberInStock: number;
  @Field()
  @Column()
  uuid: string;
}
