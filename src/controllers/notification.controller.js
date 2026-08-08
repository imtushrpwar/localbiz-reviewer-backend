const Business = require("../models/Business");
const Notification = require("../models/Notification");

const getNotifications = async (req, res) => {
  try {
    const business = await Business.findOne({
      owner: req.user.id,
    });

    const notifications = await Notification.find({
      business: business._id,
    })
      .populate({
        path: "review",
        select:
          "customerName customerPhone feedback rating sentiment createdAt",
      })
      .sort({
        createdAt: -1,
      });

    res.status(200).json({
      success: true,
      notifications,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

const getUnreadCount = async (req, res) => {
  try {
    const business = await Business.findOne({
      owner: req.user.id,
    });

    const count = await Notification.countDocuments({
      business: business._id,
      isRead: false,
    });

    res.json({
      success: true,
      count,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
    });
  }
};

const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      {
        _id: req.params.id,
      },
      {
        isRead: true,
      },
      {
        new: true,
      }
    );

    res.json({
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
    });
  }
};

const getNotificationById = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id).populate({
      path: "review",
      select: "customerName customerPhone feedback rating sentiment createdAt",
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    res.status(200).json({
      success: true,
      notification,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = {
  getNotifications,
  getUnreadCount,
  markAsRead,
  getNotificationById,
};
