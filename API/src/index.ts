import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
import Express from "express";
import { buildSchema } from "type-graphql";
import { createConnection } from "typeorm";
import { ProductResolver } from "./resolvers/ProductResolver";
const startServer = async () => {
  await createConnection(); // 1
  const schema = await buildSchema({
    // 2
    resolvers: [ProductResolver],
  });

  const app = Express(); //3
  const apolloServer = new ApolloServer({ schema }); //4
  apolloServer.applyMiddleware({ app }); // 5
  app.listen(4000, () => {
    console.log("server started");
  });
};
startServer();
