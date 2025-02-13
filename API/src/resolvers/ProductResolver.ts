import { Resolver, Query, Mutation, Arg } from "type-graphql";
import { Product } from "../entities/Product";

const producer = require("../kafka/producer");
const topic = "products";

@Resolver() //1
export class ProductResolver {
  @Query(() => [Product]) //2
  async products(): Promise<Product[]> {
    return await Product.find(); // 3
  }

  @Mutation(() => String!) //  1
  async addProduct(
    @Arg("productName") productName: string, // 2
    @Arg("description") description: string,
    @Arg("price") price: number,
    @Arg("uuid") uuid: string,
    @Arg("numberInStock") numberInStock: number
  ): Promise<String> {
    const product = Product.create({
      // 3
      productName,
      description,
      price,
      uuid,
      numberInStock,
    });
    // return await product.save(); // 4
    producer.produce(product, topic, product.uuid);
    return product.uuid;
  }
}
