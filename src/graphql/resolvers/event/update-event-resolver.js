const db = require('../../../models');
const Event = db.events;
const User = db.users;
const messages = require('../../../utils/messages');

const updateEventResolver = async (_, { input: { eventId, title, description, date, location } }, context) => {
  try {
    if (!context.token) {
      throw new Error("You must have token!!!");
    }

    const authToken = context.token;
    const userId = authToken.id;

    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error("User not found!!!");
    }

    const event = await Event.findByPk(eventId);
    if (!event) {
      throw new Error("Event not found!!!");
    }

    if (event.creator !== userId) {
      throw new Error("Unauthorized, You don't have a authority to update this Event!!!");
    }

    event.title = title,
      event.description = description,
      event.date = date,
      event.location = location,
      event.creator = userId

    await event.save();

    return { message: messages.updateEventSuccess, event }
  } catch (error) {
    console.log("Error in Update Event:", error.message);
    throw new Error("Error while updating A Event. " + error.message);
  }
}


module.exports = updateEventResolver;