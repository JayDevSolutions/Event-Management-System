const db = require('../../../models');
const Event = db.events;
const User = db.users;
const Invite = db.invites;
const messages = require('../../../utils/messages');

const inviteUserResolver = async (_, { input: { eventId, email } }, context) => {
  try {
    if (!context.token) {
      throw new Error("You must have token!!!");
    }

    const authToken = context.token;
    const authEmail = authToken.email;
    const userId = authToken.id;

    // user can not invite himself
    if (email === authEmail) {
      throw new Error("You cannot invite yourself!!!");
    }

    // checking that user is exist with the provided email or not
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new Error("User not found!!!");
    }

    // checking that event is exist or not
    const event = await Event.findByPk(eventId);
    if (!event) {
      throw new Error("Event not found!!!");
    }

    // Checking that user created this event or not
    if (event.creator !== userId) {
      throw new Error("Unauthorized, You have not created this Event!!!");
    }

    // checking that user is already invited in this event or not 
    const existingInvite = await Invite.findOne({
      where: {
        userId: user.id,
        eventId: event.id
      }
    });
    if (existingInvite) {
      throw new Error("User already invited to this event!!!");
    }

    // inviting user to event
    const invite = await Invite.create({
      userId: user.id,
      eventId: event.id
    });

    return { message: messages.inviteUserSuccess, event, invite }
  } catch (error) {
    console.log("Error in inviting user:", error.message);
    throw new Error("Error while inviting A User. " + error.message);
  }
}


module.exports = inviteUserResolver;