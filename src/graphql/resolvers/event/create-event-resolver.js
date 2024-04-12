const db = require('../../../models');
const Event = db.events;
const messages = require('../../../utils/messages');

const createEventsResolver = async (_, { input: { title, description, date, location } }, context) => {
  try {
    if (!context.token) {
      throw new Error("You must have token!!!");
    }
    const authToken = context.token;

    const userId = authToken.id;
    const newEvent = {
      title,
      description,
      creator: userId,
      date,
      location
    };

    const event = await Event.create(newEvent);

    return { message: messages.createEventSuccess, event };
  } catch (error) {
    console.log("Error in creating event:", error.message);
    throw new Error("Error while creating An Event " + error.message);
  }
}

module.exports = createEventsResolver;