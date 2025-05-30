const fetch = require("node-fetch");

exports.handler = async (event) => {
  const { message } = JSON.parse(event.body || "{}");

  if (!message) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "No message provided" }),
    };
  }

  const openaiKey = process.env.OPENAI_API_KEY;
  const discordWebhook = process.env.DISCORD_WEBHOOK_URL;

  try {
    // 1. Ask OpenAI
    const chatRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${openaiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "user", content: message }
        ],
      }),
    });

    const chatData = await chatRes.json();
    const gptReply = chatData.choices?.[0]?.message?.content || "No reply";

    // 2. Send to Discord via Webhook
    const discordRes = await fetch(discordWebhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: `**User asked:** ${message}\n**ChatGPT replied:**\n${gptReply}`
      }),
    });

    if (!discordRes.ok) throw new Error("Failed to send to Discord");

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, reply: gptReply }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
