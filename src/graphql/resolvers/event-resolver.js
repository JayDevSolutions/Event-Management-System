const allEventsResolver = require('./event/all-events-resolver');
const fetchEventResolver = require('./event/fetch-event-resolver');
const createEventResolver = require('./event/create-event-resolver');
const inviteUserResolver = require('./event/invite-user-resolver');
const updateEventResolver = require('./event/update-event-resolver');
const deleteEventResolver = require('./event/delete-event-resolver');

const eventResolver = {
  Query: {

    allEvents: allEventsResolver,

    fetchEvent: fetchEventResolver
  },

  Mutation: {

    createEvent: createEventResolver,

    inviteUser: inviteUserResolver,

    updateEvent: updateEventResolver,

    deleteEvent: deleteEventResolver
  }
}

module.exports = eventResolver;