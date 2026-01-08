const Groq = require("groq-sdk");

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const generateMovieBlog = async (movie) => {

  try {

    const prompt = `
Return ONLY a valid JSON object (no markdown, no explanation) in this exact format:

{
  "synopsis": "Brief story summary (3-4 lines)",
  "performance": "Actors, direction, music analysis",
  "pros": ["point1", "point2", "point3"],
  "cons": ["point1", "point2"],
  "verdict": "Final critical opinion",
  "audience": "Who should watch this movie"
}

Movie:
Title: ${movie.title}
Overview: ${movie.overview}
Release date: ${movie.release_date}
Language: ${movie.original_language}
Rating: ${movie.vote_average}
Cast: ${movie.credits?.cast?.slice(0,5).map(c => c.name).join(", ")}
`;

    const completion = await groq.chat.completions.create({
      model: "llama3-70b-8192",
      temperature: 0.6,
      max_tokens: 900,
      messages: [
        { role: "system", content: "You are an expert Indian movie critic and SEO blogger." },
        { role: "user", content: prompt }
      ]
    });

    const raw = completion.choices[0]?.message?.content || "";

    // ✅ JSON safety guard
    try {
      const parsed = JSON.parse(raw);
      return parsed;
    } catch (e) {
      console.error("Groq JSON Parse Failed");
      return {};
    }

  } catch (error) {
    console.error("Groq AI Error:", error.message);
    return {};
  }
};

module.exports = { generateMovieBlog };
