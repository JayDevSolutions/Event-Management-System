'use strict';

const eventSchema = `#graphql
  directive @auth on FIELD_DEFINITION
  
  type Event {
    id: ID
    title: String
    description: String
    date: String
    location: String
    creator: ID
    user: User
    invitations: [Invite]
  }
  type User {
    id: ID
    username: String
  }
  type Invite {
    userId: ID
    eventId: ID
    user: User
  }

  extend type Query {
    allEvents(input: Filters): AllEventsResponse @auth
    fetchEvent(eventId: Int!): Event @auth
  }
  extend type Mutation {
    createEvent(input: CreateEventInput!): CreateEventResponse @auth
    inviteUser(input: InviteUserInput!): InviteUserResponse @auth
    updateEvent(input: UpdateEventInput!): UpdateEventResponse @auth
    deleteEvent(eventId: Int!): DeleteEventResponse @auth
  }

  # input of pagination for allEvents
  input Filters {
    page: Int
    limit: Int
    sortBy: String
    sortOrder: SortOrder
    startDate: String
    endDate: String
    search: String
  }
  enum SortOrder {
    ASC
    DESC
  }
  # allEvents response
  type AllEventsResponse {
    message: String
    usersEvents: [Event!]
    invitedEvents: [Event!]
  }

  # create event input and response
  input CreateEventInput {
    title: String!
    description: String!
    date: String!
    location: String!
  }
  type CreateEventResponse {
    message: String
    event: Event
  }

  # invite event input and response
  input InviteUserInput {
    eventId: Int!
    email: String!
  }
  type InviteUserResponse {
    message: String
    event: Event
    invite: Invite
  }

  # update Event input and response
  input UpdateEventInput {
    eventId: Int!
    title: String!
    description: String!
    date: String!
    location: String!
  }
  type UpdateEventResponse {
    message: String
    event: Event
  }

  # delete Event response
  type DeleteEventResponse {
    message: String
    event: Event
  }
`;

module.exports = eventSchema;