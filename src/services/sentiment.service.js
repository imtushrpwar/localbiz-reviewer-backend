const ai = require("./gemini.service");

const analyzeSentiment = async (reviewText) => {
  try {
    const prompt = `
Analyze the sentiment of the following customer review.

Review:
"${reviewText}"

Return ONLY valid JSON.

Example:

{
  "sentiment": "positive"
}

Allowed values:
- positive
- neutral
- negative
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

    return result.sentiment;

  } catch (error) {
    console.error("Sentiment Error:", error);
    return "neutral";
  }
};

module.exports = analyzeSentiment;