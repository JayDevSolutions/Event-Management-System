require('dotenv').config();
const cors = require('cors');
const http = require('http');
const express = require('express');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const { ApolloServerPluginDrainHttpServer } = require('@apollo/server/plugin/drainHttpServer');
const db = require('./models/index.js');
const schema = require('./graphql/schemas/index.js');

const startServer = async () => {

  const app = express();

  const httpServer = http.createServer(app);

  const server = new ApolloServer({
    introspection: true,
    schema,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })]
  });

  await server.start();

  app.use(
    '/graphql',
    cors(),
    express.json(),
    expressMiddleware(server, {
      context: async ({ req }) => ({
        token: req.header("Authorization")?.replace("Bearer ", "")
      }),
    }),
  );

  db.sequelize.sync({ force: false })
    .then(async () => {
      console.log('database synced!');
    });

  const port = process.env.PORT || 3000;

  await new Promise((resolve) => httpServer.listen({ port }, resolve));

  console.log(`🚀 Server ready at http://localhost:${port}/graphql`);
};

startServer();




