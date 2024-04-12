const { mergeTypeDefs } = require('@graphql-tools/merge');
const { makeExecutableSchema } = require('graphql-tools');

const authDirective = require('../../directives/authDirective.js');

const userSchema = require("./user-schema.js");
const eventSchema = require("./event-schema.js");
const resolvers = require('../resolvers');

const linkedSchema = `#graphql
  type Query {
    _: Boolean
  }

  type Mutation {
    _: Boolean
  }
`;

const schema = [userSchema, eventSchema];
const typeDefs = mergeTypeDefs([linkedSchema, schema]);

let newSchema = makeExecutableSchema({
  typeDefs,
  resolvers
});

newSchema = authDirective(newSchema, 'auth');

module.exports = newSchema;