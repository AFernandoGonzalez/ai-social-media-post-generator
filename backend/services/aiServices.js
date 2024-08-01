const OpenAI = require('openai');

if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY environment variable is required. Get it from https://platform.openai.com/signup/");
}

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// function buildPrompt({ topic, platform, tone, style, mediaUrl }) {
//     console.log("buildPrompt args: ", topic, platform, tone, style, mediaUrl);
//     let basePrompt = `Create a social media post about "${topic}".`;

    
//     switch (platform) {
//         case 'Instagram':
//             basePrompt += `
// 1. Caption:
// 2. Hashtags:
// 3. Call-to-action:
// `;
//             if (mediaUrl) basePrompt += ` Analyze the media at ${mediaUrl} and suggest a caption.`;
//             break;
//         case 'Twitter':
//             basePrompt += `
// 1. Text:
// 2. Hashtags:
// 3. Mentions:
// `;
//             if (mediaUrl) basePrompt += ` Analyze the media at ${mediaUrl} and suggest tweet content.`;
//             break;
//         case 'Facebook':
//             basePrompt += `
// 1. Text:
// 2. Hashtags:
// `;
//             break;
//         case 'LinkedIn':
//             basePrompt += `
// 1. Text:
// 2. Professional hashtags:
// `;
//             break;
//         case 'YouTube':
//             basePrompt += `
// 1. Title:
// 2. Description:
// 3. Tags:
// 4. Thumbnail suggestions:
// `;
//             break;
//         case 'Pinterest':
//             basePrompt += `
// 1. Title:
// 2. Description:
// 3. Hashtags:
// 4. Image suggestion:
// `;
//             break;
//         default:
//             basePrompt += ' Provide a general social media post.';
//             break;
//     }

//     // Add tone and style
//     if (tone) {
//         basePrompt += ` The tone should be ${tone}.`;
//     }

//     if (style) {
//         basePrompt += ` The style should be ${style}.`;
//     }

//     return [
//         {
//             role: 'user',
//             content: basePrompt,
//         },
//     ];
// }

function buildPrompt({ topic, platform, tone, style, mediaUrl }) {
    console.log("buildPrompt args: ", topic, platform, tone, style, mediaUrl);
    let basePrompt = `Create a social media post about "${topic}". Ensure to include all the sections as specified below for the selected platform. Follow the character limits where specified.`;

    switch (platform) {
        case 'Instagram':
            basePrompt += `
1. Caption: Provide a catchy caption that describes the topic.
2. Hashtags: List relevant hashtags to increase visibility.
3. Call-to-action: Suggest an action for the audience to take.
`;
            if (mediaUrl) basePrompt += `Analyze the media at ${mediaUrl} and suggest a caption.\n`;
            break;
        case 'Twitter':
            basePrompt += `
1. Text: Write a brief and engaging tweet (up to 280 characters).
2. Hashtags: Include hashtags relevant to the tweet's content.
`;
            if (mediaUrl) basePrompt += `Analyze the media at ${mediaUrl} and suggest tweet content.\n`;
            break;
        case 'Facebook':
            basePrompt += `
1. Text: Write the main content of the post.
2. Hashtags: Include hashtags to categorize the post.
`;
            break;
        case 'LinkedIn':
            basePrompt += `
1. Text: Provide a professional description of the topic.
2. Professional hashtags: Include hashtags relevant to the professional or industry context.
`;
            break;
        case 'YouTube':
            basePrompt += `
1. Title: Create an engaging title for the video (up to 100 characters).
2. Description: Describe the content of the video.
3. Tags: Include tags to help categorize the video.
4. Thumbnail suggestions: Suggest ideas for the video thumbnail.
`;
            break;

        default:
            basePrompt += ' Provide a general social media post including a description, hashtags, and a call-to-action.';
            break;
    }

    // Add tone and style
    if (tone) {
        basePrompt += ` The tone should be ${tone}.`;
    }

    if (style) {
        basePrompt += ` The style should be ${style}.`;
    }

    return [
        {
            role: 'user',
            content: basePrompt,
        },
    ];
}


exports.generateContent = async ({ topic, platform, tone, style, mediaUrl }) => {
    try {
        const prompt = buildPrompt({ topic, platform, tone, style, mediaUrl });

        const query = {
            model: 'gpt-4',
            messages: prompt,
            max_tokens: 300, // Adjust as needed
            temperature: 0.7,
        };

        console.log("Generated query: ", query);

        const completion = await openai.chat.completions.create(query);
        console.log("OpenAI response: ", completion);

        return completion.choices[0].message.content;
    } catch (error) {
        console.error('Error generating content with OpenAI:', error.message);
        throw new Error('Failed to generate content');
    }
};

exports.translateText = async (text, targetLang) => {
    try {
        const prompt = `Translate the following text to ${targetLang}: "${text}"`;

        const query = {
            model: 'gpt-4',
            messages: [{ role: 'user', content: prompt }],
            max_tokens: 1000,
            temperature: 0.7,
        };

        console.log("Generated translation query: ", query);

        const completion = await openai.chat.completions.create(query);
        console.log("Translation response: ", completion);

        return completion.choices[0].message.content;
    } catch (error) {
        console.error('Error translating text with OpenAI:', error.message);
        throw new Error('Failed to translate text');
    }
};
