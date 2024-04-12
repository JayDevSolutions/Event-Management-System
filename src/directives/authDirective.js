const { mapSchema, getDirective, MapperKind } = require('@graphql-tools/utils');
const { defaultFieldResolver } = require('graphql');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET;
const { tokens } = require('../models/index');
const { Op } = require('sequelize');

const authDirective = (schema, directiveName) => mapSchema(schema, {
  [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
    const authDirective = getDirective(schema, fieldConfig, directiveName)?.[0];
    if (authDirective) {
      const { resolve = defaultFieldResolver } = fieldConfig;

      fieldConfig.resolve = async (source, args, context, info) => {
        const { token } = context;

        try {
          if (!token) {
            throw new Error('Unauthorized - Missing Token');
          }

          const decodedToken = jwt.verify(token, secret, { algorithms: ['HS256'] });

          const validToken = await tokens.findOne({
            where: {
              userId: decodedToken.id,
              token,
              tokenType: 'ACCESS',
              expiredAt: { [Op.gte]: new Date() }
            }
          });
          if (!validToken) {
            throw new Error('Unauthorized. Invalid or expired access token.');
          }

          context.token = decodedToken;

          return await resolve(source, args, context, info);
        } catch (error) {
          console.log("Authentication Error:", error)
          throw new Error('Error while authenticating ' + error.message);
        }
      };
    }
  },
});


module.exports = authDirective;

