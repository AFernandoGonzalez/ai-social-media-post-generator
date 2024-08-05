// const { createOpenAI } = require('@ai-sdk/openai');
// const { streamText } = require('ai');

// if (!process.env.OPENAI_API_KEY) {
//     throw new Error("OPENAI_API_KEY environment variable is required. Get it from https://platform.openai.com/signup/");
// }

// const openaiInstance = createOpenAI({
//     apiKey: process.env.OPENAI_API_KEY,
//     compatibility: 'strict',
// });

// function buildPrompt({ topic, platform, type, tone, style, mediaUrl }) {
//     let basePrompt = `Create a ${type} for a social media post about "${topic}" on ${platform}.`;

//     if (tone) {
//         basePrompt += ` The tone should be ${tone}.`;
//     }

//     if (style) {
//         basePrompt += ` The style should be ${style}.`;
//     }

//     if (mediaUrl) {
//         basePrompt += ` Analyze the media at ${mediaUrl}.`;
//     }

//     return basePrompt;
// }

// exports.generateContent = async ({ topic, platform, type, tone, style, mediaUrl }) => {
//     try {
//         const prompt = buildPrompt({ topic, platform, type, tone, style, mediaUrl });

//         const result = await streamText({
//             model: openaiInstance('gpt-4-turbo'),
//             prompt: prompt,
//             max_tokens: 300,
//             temperature: 0.7,
//         });

//         let fullResponse = '';
//         for await (const textPart of result.textStream) {
//             fullResponse += textPart;
//         }

//         return fullResponse;
//     } catch (error) {
//         console.error('Error generating content with OpenAI:', error.message);
//         throw new Error('Failed to generate content');
//     }
// };


const { createOpenAI } = require('@ai-sdk/openai');
const { streamText } = require('ai');

if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY environment variable is required. Get it from https://platform.openai.com/signup/");
}

const openaiInstance = createOpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    compatibility: 'strict',
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

    return basePrompt;
}

async function moderateContent(content) {
    const moderationResponse = await openaiInstance.moderations.create({
        input: content,
    });

    const { results } = moderationResponse;
    const flagged = results.some(result => result.flagged);

    return flagged;
}

exports.generateContent = async ({ topic, platform, type, tone, style, mediaUrl }) => {
    try {
        const prompt = buildPrompt({ topic, platform, type, tone, style, mediaUrl });

        const result = await streamText({
            model: openaiInstance('gpt-4-turbo'),
            prompt: prompt,
            max_tokens: 300,
            temperature: 0.7,
        });

        let fullResponse = '';
        for await (const textPart of result.textStream) {
            fullResponse += textPart;
        }

        const isInappropriate = await moderateContent(fullResponse);
        if (isInappropriate) {
            throw new Error('Generated content is inappropriate');
        }

        return fullResponse;
    } catch (error) {
        console.error('Error generating content with OpenAI:', error.message);
        throw new Error('Failed to generate content');
    }
};
