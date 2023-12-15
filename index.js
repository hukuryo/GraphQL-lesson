const { ApolloServer, gql } = require('apollo-server');

const typeDefs = gql`
  type Query{
    hello(name: String!): String,
    body(contents: String!): String
  }
`

const resolvers = {
    Query: {
        hello: (parent, args) => `Hello ${args.name}`,
        body: (parent, args) => {
            console.log('body parent', parent);
            console.log('body args', args);
            return 'return body';
        },
    },
}

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});