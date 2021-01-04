require("dotenv").config();
import { ApolloServer } from "apollo-server";
import { typeDefs } from "./schema";
import { resolvers } from "./resolvers";

import { LaunchAPI } from "./datasources/launch";
// import { UserAPI } from "./datasources/user";

const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: () => ({
    launchAPI: new LaunchAPI(),
    // userAPI: new UserAPI({}),
  }),
});

server.listen().then(() => {
  console.log(`
    Server is running!
    Listening on port http://localhost:4000
    Explore at https://studio.apollographql.com/dev
  `);
});
