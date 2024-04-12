'use strict';

const userSchema = `#graphql
  directive @auth on FIELD_DEFINITION

  type User {
    id: ID
    firstName: String
    lastName: String
    username: String
    email: String
  }

  extend type Query {
    allUsers: [User] @auth
    fetchUser(id: Int!): User @auth
  }

  extend type Mutation {
    register(input: RegisterInput!): RegisterUserResponse
    login(email: String!, password: String!): LoginResponse
    changePassword(oldPassword: String!, newPassword: String!): ChangePasswordResponse @auth
    resetPassword(email: String!): ResetPasswordResponse
    updatePassword(resetToken: String!, oldPassword: String!, newPassword: String!): UpdatePasswordResponse
    logout: LogoutResponse 
  }

  # Registration input and response
  input RegisterInput {
    username: String! 
    firstName: String!
    lastName: String!
    email: String!
    password: String!
  }
  type RegisterUserResponse {
    message: String
    user: User
  }

  # Login response
  type LoginResponse {
    message: String
    user: User
    token: String
  }

  # change password response
  type ChangePasswordResponse {
    message: String
    user: User
  }
  
  # reset password response
  type ResetPasswordResponse {
    message: String
    resetToken: String
  }
  
  # update user input and response
  input UpdateInput {
    username: String!
    firstName: String!
    lastName: String!
    email: String!
    password: String!
  }
  type UpdatePasswordResponse {
    message: String
    user: User
  }

  # logout response
  type LogoutResponse {
    message: String
  }

`;

module.exports = userSchema;