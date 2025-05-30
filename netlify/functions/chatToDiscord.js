exports.handler = async (event) => {
    try {
        if (event.httpMethod !== "POST") {
            return {
                statusCode: 405,
                body: JSON.stringify({ error: "Method Not Allowed" }),
            };
        }

        const { message } = JSON.parse(event.body || "{}");

        if (!message) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: "No message provided" }),
            };
        }

        const openaiKey = process.env.OPENAI_API_KEY;
        const discordWebhook = process.env.DISCORD_WEBHOOK_URL;

        if (!openaiKey || !discordWebhook) {
            return {
                statusCode: 500,
                body: JSON.stringify({ error: "Missing environment variables" }),
            };
        }

        // Call OpenAI Chat Completion
        const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${openaiKey}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [{ role: "user", content: message }],
            }),
        });

        if (!openaiResponse.ok) {
            const errorBody = await openaiResponse.text();
            return {
                statusCode: openaiResponse.status,
                body: JSON.stringify({ error: `OpenAI API error: ${errorBody}` }),
            };
        }

        const chatData = await openaiResponse.json();

        // Debug: return full OpenAI response if needed
        // console.log("OpenAI response:", chatData);

        const gptReply = chatData.choices?.[0]?.message?.content;

        if (!gptReply) {
            return {
                statusCode: 500,
                body: JSON.stringify({ error: "OpenAI response missing content", openaiResponse: chatData }),
            };
        }

        // Send message to Discord via webhook
        const discordResponse = await fetch(discordWebhook, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                content: `**User asked:** ${message}\n**ChatGPT replied:**\n${gptReply}`,
            }),
        });

        if (!discordResponse.ok) {
            const errorBody = await discordResponse.text();
            return {
                statusCode: discordResponse.status,
                body: JSON.stringify({ error: `Discord webhook error: ${errorBody}` }),
            };
        }

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
