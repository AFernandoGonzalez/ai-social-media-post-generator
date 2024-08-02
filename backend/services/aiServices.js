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

// function buildPrompt({ topic, platform, tone, style, mediaUrl }) {
//     let basePrompt = `Create a social media post about "${topic}" for ${platform} in a structured format.`;

//     switch (platform) {
//         case 'Instagram':
//             basePrompt += `
// {
//   "caption": "Provide a catchy caption",
//   "hashtags": "List relevant hashtags",
//   "callToAction": "Suggest a call-to-action"
// }`;
//             if (mediaUrl) basePrompt += ` Analyze the media at ${mediaUrl} and suggest a caption.\n`;
//             break;
//         case 'Twitter':
//             basePrompt += `
// {
//   "text": "Write a brief and engaging tweet",
//   "hashtags": "Include relevant hashtags"
// }`;
//             if (mediaUrl) basePrompt += ` Analyze the media at ${mediaUrl} and suggest tweet content.\n`;
//             break;
//         case 'Facebook':
//             basePrompt += `
// {
//   "text": "Write the main content",
//   "hashtags": "Include relevant hashtags"
// }`;
//             break;
//         case 'LinkedIn':
//             basePrompt += `
// {
//   "text": "Provide a professional description",
//   "professionalHashtags": "Include relevant professional hashtags"
// }`;
//             break;
//         case 'YouTube':
//             basePrompt += `
// {
//   "title": "Create an engaging title",
//   "description": "Describe the video content",
//   "tags": "Include relevant tags",
//   "thumbnailSuggestions": "Suggest ideas for the video thumbnail"
// }`;
//             break;
//         default:
//             basePrompt += ` Provide a general social media post including a description, hashtags, and a call-to-action.`;
//             break;
//     }

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

        console.log("Generated query: ", query);

        const completion = await openai.chat.completions.create(query);
        console.log("OpenAI response: ", completion);

        return completion.choices[0].message.content;
    } catch (error) {
        console.error('Error generating content with OpenAI:', error.message);
        throw new Error('Failed to generate content');
    }
};