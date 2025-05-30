import { OpenAI } from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export const handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method not allowed' }),
        };
    }

    const { message } = JSON.parse(event.body || '{}');
    if (!message) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Missing message' }),
        };
    }

    try {
        const gptResponse = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: message }],
        });

        const reply = gptResponse.choices?.[0]?.message?.content || 'No reply';

        await fetch(process.env.DISCORD_WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                content: `**User:** ${message}\n**GPT:** ${reply}`,
            }),
        });

        return {
            statusCode: 200,
            body: JSON.stringify({ success: true, reply }),
        };
    } catch (error) {
        console.error(error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }),
        };
    }
};