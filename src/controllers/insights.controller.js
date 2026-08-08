const Business = require("../models/Business");
const Review = require("../models/Review");
const ai = require("../services/gemini.service");
const Insight = require("../models/Insight");

const getInsights = async (req, res) => {
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

    const insight = await Insight.findOne({
      business: business._id,
    });

    if (!insight) {
      return res.status(404).json({
        success: false,
        message: "Insights not generated yet",
      });
    }

    res.status(200).json({
      success: true,
      insights: insight,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });

  }
};


const generateInsightsAndSave = async (req, res) => {
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
    }).select("rating feedback");

    if (reviews.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No reviews available for analysis",
      });
    }

    const reviewText = reviews
      .map(
        (review) =>
          `Rating: ${review.rating}/5 | Review: ${review.feedback}`
      )
      .join("\n");

    const prompt = `
You are an expert business consultant.

Analyze these customer reviews.

${reviewText}

Return ONLY valid JSON.

{
  "summary":"...",
  "strengths":[
    "...",
    "...",
    "..."
  ],
  "weaknesses":[
    "...",
    "...",
    "..."
  ],
  "suggestions":[
    "...",
    "...",
    "..."
  ]
}
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    let text = response.text.trim();

    text = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const result = JSON.parse(text);

    const savedInsight = await Insight.findOneAndUpdate(
      { business: business._id },
      {
        summary: result.summary,
        strengths: result.strengths,
        weaknesses: result.weaknesses,
        suggestions: result.suggestions,
        generatedAt: new Date(),
      },
      {
        new: true,
        upsert: true,
      }
    );

    res.status(200).json({
      success: true,
      message: "Insights generated successfully",
      insights: savedInsight,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to generate AI insights",
    });
  }
};

module.exports = {
  getInsights,
  generateInsightsAndSave,
};