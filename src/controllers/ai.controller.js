const ai = require("../services/gemini.service");
const Business = require("../models/Business");
const { GoogleGenAI } = require("@google/genai");

const generateReview = async (req, res) => {
  try {
    const { slug, keywords } = req.body;

    if (!slug || !keywords) {
      return res.status(400).json({
        success: false,
        message: "Slug and keywords are required",
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

    const businessName = business.businessName;
    const category = business.category;

    const prompt = `
You are an expert local SEO copywriter.

Business Name:
${businessName}

Category:
${category}

Customer Keywords:
${keywords}

Generate EXACTLY 3 different customer reviews.

Rules:

- Maximum 200 characters each
- Natural English
- Human sounding
- Mention keywords naturally
- No emojis
- No numbering
- Return ONLY valid JSON.

Example:

{
  "reviews": [
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

    // Gemini usually returns markdown like ```json ... ```
    let text = response.text.trim();

    text = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const result = JSON.parse(text);

    res.status(200).json({
      success: true,
      reviews: result.reviews,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "AI Review Generation Failed",
    });
  }
};

// Customer review webiste backend API endpoint to generate reviews using Gemini AI. It takes a business slug and customer keywords, retrieves the business details, and generates three unique customer reviews based on the provided information. The reviews are returned in JSON format.


const aiAssist = async (req, res) => {
  try {
    const { rating, tags = [], draft = "" } = req.body;

    const prompt = `
You are a customer review assistant.

Rating: ${rating}
Tags: ${tags.join(", ")}
Draft review: ${draft}

Rewrite the review professionally.

Rules:
- Maximum 80 words.
- Keep the meaning unchanged.
- Return only the review text.
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    res.json({
      success: true,
      suggestion: response.text,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "AI generation failed",
    });
  }
};

module.exports = {
  generateReview,
  aiAssist,
};
