
const db = require('../../../models');
const Event = db.events;
const User = db.users;
const messages = require('../../../utils/messages');

const deleteEventResolver = async (_, { eventId }, context) => {
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
      throw new Error("Unauthorized, You don't have a authority to delete this Event!!!");
    }

    await event.destroy();

    return { message: messages.deleteEventSuccess, event };
  } catch (error) {
    console.log("Get event error:", error.message);
    throw new Error("Error while getting A Event " + error.message);
  }
}



module.exports = deleteEventResolver;