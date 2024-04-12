const db = require('../../../models');
const Event = db.events;
const User = db.users;
const Invite = db.invites;
const messages = require('../../../utils/messages');
const { Op } = require('sequelize');

const allEventsResolver = async (_, { input: { page, limit, sortBy, sortOrder, startDate, endDate, search } }, context) => {
  try {
    // Pagination settings
    const offset = (page - 1) * limit;
    const dateFilter = {};
    if (startDate && endDate) {
      dateFilter.date = { [Op.between]: [new Date(startDate), new Date(endDate)] };
    } else if (startDate) {
      dateFilter.date = { [Op.gte]: new Date(startDate) };
    } else if (endDate) {
      dateFilter.date = { [Op.lte]: new Date(endDate) };
    }

    if (!context.token) {
      throw new Error("You must have token!!!");
    }
    const authToken = context.token;
    const userId = authToken.id;

    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error("User not found!!!");
    }

    // Fetching user's created events
    const usersEvents = await Event.findAll({
      where: {
        creator: user.id,
        [Op.and]: [
          dateFilter,
          search ? { title: { [Op.iLike]: `%${search}%` } } : {},
        ],
      },
      order: [[sortBy, sortOrder]],
      limit,
      offset
    });

    // Fetching user's events in which the user is invited
    const invitedEvents = await Event.findAll({
      include: [
        {
          model: User,
          as: 'user'
        },
        {
          model: Invite,
          as: 'invitations',
          where: {
            userId: user.id,
          }
        }
      ],
      where: {
        [Op.and]: [
          dateFilter,
          search ? { title: { [Op.iLike]: `%${search}%` } } : {},
        ],
      },
      order: [[sortBy, sortOrder]],
      limit,
      offset
    });

    return { message: messages.allEventsSuccess, usersEvents, invitedEvents };
  } catch (error) {
    console.log("Get events error:", error.message);
    throw new Error("Error while getting All events. " + error.message);
  }
}


module.exports = allEventsResolver;