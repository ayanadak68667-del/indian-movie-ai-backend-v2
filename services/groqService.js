const Groq = require("groq-sdk");

// Render/Glitch এর Environment থেকে Key নেবে
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const generateMovieBlog = async (movieData) => {
  try {
    const chatCompletion = await groq.chat.completions.create({
      "messages": [
        {
          "role": "system",
          "content": "You are an expert Indian Cinema Critic and SEO Blogger for 'Filmi Bharat'. Write a detailed review with sections: Synopsis, Performance, Pros & Cons, Box-office, and Target Audience. Use professional and engaging tone."
        },
        {
          "role": "user",
          "content": `Write a blog for the movie: ${movieData.title}. Plot: ${movieData.overview}. Cast: ${movieData.cast}. Language: ${movieData.language}.`
        }
      ],
      "model": "llama3-70b-8192", // দ্রুততম এবং শক্তিশালী মডেল
      "temperature": 0.7,
      "max_tokens": 1024
    });

    return chatCompletion.choices[0]?.message?.content || "";
  } catch (error) {
    console.error("Groq AI Error:", error);
    return "Review is currently being updated. Please check back later.";
  }
};

module.exports = { generateMovieBlog };
