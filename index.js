// import axios from 'axios';

const { ApolloServer, gql } = require('apollo-server');
const { default: axios } = require('axios');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();


const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
  }

  type Post {
    id: ID!
    title: String!
    body: String!
    userId: ID!
  }

  type Query {
    hello(name: String!): String
    users: [User]
    user(id: ID!): User
    posts: [Post]
  }

  type Mutation {
    createUser(name: String!, email: String!): User
    updateUser(id: Int!, name: String!): User
    deleteUser(id: Int!): User
  }
`;

const resolvers = {
  Query: {
    hello: (parent, args) => `Hello ${args.name}`,
    users: async () => {
        const response = await axios.get(
            'https://jsonplaceholder.typicode.com/users'
        );
        return response.data;
    },
    users: () => {
        return prisma.user.findMany();
    },
    posts: async () => {
        const response = await axios.get(
            'https://jsonplaceholder.typicode.com/posts'
        )
        return response.data
    },
    Mutation: {
        createUser: (_, args) => {
          return prisma.user.create({
            data: {
              name: args.name,
              email: args.email,
            },
          });
        },
        updateUser: (_, args) => {
          return prisma.user.update({
            where: {
              id: args.id,
            },
            data: {
              name: 'John Doe',
            },
          });
        },
        deleteUser: (_, args) => {
          return prisma.user.delete({
            where: { id: args.id },
          });
        },
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});