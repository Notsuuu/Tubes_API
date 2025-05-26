const axios = require("axios");

const askOpenAI = async (prompt) => {
  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content:
              "Kamu adalah asisten UMKM yang membantu menjelaskan daftar UMKM di Kota Palu dalam format rapi dan mudah dibaca.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error("OpenAI Error:", error.response?.data || error.message);
    throw new Error("Gagal mendapatkan respon dari OpenAI.");
  }
};

module.exports = { askOpenAI };
