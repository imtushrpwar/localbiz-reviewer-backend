const Notification = require("../models/Notification");

const createNotification = async (
  businessId,
  reviewId,
  type,
  title,
  message
) => {
  await Notification.create({
    business: businessId,
    review: reviewId,
    type,
    title,
    message,
  });

};

module.exports = createNotification;