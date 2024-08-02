const OpenAI = require('openai');

if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY environment variable is required. Get it from https://platform.openai.com/signup/");
}

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});


function buildPrompt({ topic, platform, type, tone, style, mediaUrl }) {
    let basePrompt = `Create a ${type} for a social media post about "${topic}" on ${platform}.`;

    if (tone) {
        basePrompt += ` The tone should be ${tone}.`;
    }

    if (style) {
        basePrompt += ` The style should be ${style}.`;
    }

    if (mediaUrl) {
        basePrompt += ` Analyze the media at ${mediaUrl}.`;
    }

    return [
        {
            role: 'user',
            content: basePrompt,
        },
    ];
}

exports.generateContent = async ({ topic, platform, type, tone, style, mediaUrl }) => {
    try {
        const prompt = buildPrompt({ topic, platform, type, tone, style, mediaUrl });

        const query = {
            model: 'gpt-4',
            messages: prompt,
            max_tokens: 300,
            temperature: 0.7,
        };

        const completion = await openai.chat.completions.create(query);
        return completion.choices[0].message.content;
    } catch (error) {
        console.error('Error generating content with OpenAI:', error.message);
        throw new Error('Failed to generate content');
    }
};