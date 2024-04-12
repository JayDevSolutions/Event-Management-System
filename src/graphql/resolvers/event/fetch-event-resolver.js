
const db = require('../../../models');
const Event = db.events;
const User = db.users;
const Invite = db.invites;

const fetchEventResolver = async (_, { eventId }, context) => {
  try {
    if (!context.token) {
      throw new Error("You must have token!!!");
    }

    const authToken = context.token;
    const userId = authToken.id;

    const event = await Event.findByPk(eventId,
      {
        include: [
          {
            model: Invite,
            as: 'invitations',
            include: [
              {
                model: User,
                as: 'user'
              }
            ]
          }
        ]
      });
    if (!event) {
      throw new Error("Event not found!!!");
    }

    if (event.creator !== userId) {
      throw new Error("Unauthorized, You don't have a authority to see this Event!!!");
    }

    return event;
  } catch (error) {
    console.log("Get event error:", error.message);
    throw new Error("Error while getting A Event " + error.message);
  }
}



module.exports = fetchEventResolver;