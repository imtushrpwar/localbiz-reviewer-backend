const Business = require("../models/Business");
const Review = require("../models/Review");
const analyzeSentiment = require("../services/sentiment.service");
const createNotification = require(
  "../services/notification.service"
);

// GET /api/review/:slug

const getBusinessBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const business = await Business.findOne({ slug }).select(
      "-owner -qrCode -createdAt -updatedAt -__v"
    );

    if (!business) {
      return res.status(404).json({
        success: false,
        message: "Business not found",
      });
    }

    res.status(200).json({
      success: true,
      business,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// POST /api/review

const submitReview = async (req, res) => {
  try {
    const { slug, rating, feedback, customerName, customerPhone } = req.body;

    if (!slug || !rating) {
      return res.status(400).json({
        success: false,
        message: "Slug and Rating are required",
      });
    }

    // Find Business
    const business = await Business.findOne({ slug });

    if (!business) {
      return res.status(404).json({
        success: false,
        message: "Business not found",
      });
    }

    const sentiment = await analyzeSentiment(feedback);

   

    const review = await Review.create({
      business: business._id,
      rating,
      feedback,
      customerName,
      customerPhone,
      sentiment,
      aiProcessed: true,
    });

    if (sentiment?.trim().toLowerCase() === "negative") {
  await createNotification(
    business._id,
    review._id,
    "negative_review",
    "Negative Review Alert",
    "A customer submitted a negative review."
  );
}

    res.status(201).json({
      success: true,
      message: "Review submitted successfully",
      review,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// GET /api/review/business

const getBusinessReviews = async (req, res) => {
  try {
    // Find Business

    const business = await Business.findOne({
      owner: req.user.id,
    });

    if (!business) {
      return res.status(404).json({
        success: false,
        message: "Business not found",
      });
    }

    // Get Reviews

    const reviews = await Review.find({
      business: business._id,
    }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,

      totalReviews: reviews.length,

      reviews,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// GET /api/review/dashboard

const dashboard = async (req, res) => {
  try {
    const business = await Business.findOne({
      owner: req.user.id,
    });

    if (!business) {
      return res.status(404).json({
        success: false,
        message: "Business not found",
      });
    }

    const reviews = await Review.find({
      business: business._id,
    }).sort({
      createdAt: -1,
    });

    const sentimentCount = {
      positive: 0,
      neutral: 0,
      negative: 0,
    };

    reviews.forEach((review) => {
      if (sentimentCount[review.sentiment] !== undefined) {
        sentimentCount[review.sentiment]++;
      }
    });

    const totalReviews = reviews.length;

    const averageRating =
      totalReviews > 0
        ? (
            reviews.reduce((sum, review) => sum + review.rating, 0) /
            totalReviews
          ).toFixed(1)
        : 0;

    const ratingCount = {
      5: 0,
      4: 0,
      3: 0,
      2: 0,
      1: 0,
    };

    reviews.forEach((review) => {
      ratingCount[review.rating]++;
    });

    res.status(200).json({
      success: true,
      totalReviews,
      averageRating,
      ratingCount,
      sentimentCount,
      latestReviews: reviews.slice(0, 5),
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,

      message: "Server Error",
    });
  }
};

module.exports = {
  getBusinessBySlug,

  submitReview,

  getBusinessReviews,

  dashboard,
};
