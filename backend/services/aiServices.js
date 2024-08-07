const { createOpenAI } = require('@ai-sdk/openai');
const { streamText } = require('ai');
const fs = require('fs');
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('ffmpeg-static');
const { uploadToR2 } = require('./cloudflareR2Service');
const OpenAI = require('openai');
const openai = new OpenAI();

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

exports.generateContent = async ({ topic, platform, type, tone, style, mediaUrl }) => {
    try {
        const prompt = buildPrompt({ topic, platform, type, tone, style, mediaUrl });

        const result = await streamText({
            model: openaiInstance('gpt-4'),
            prompt: prompt,
            max_tokens: 300,
            temperature: 0.7,
        });

        let fullResponse = '';
        for await (const textPart of result.textStream) {
            fullResponse += textPart;
        }

        // return fullResponse;
        const sanitizedResponse = fullResponse.replace(/^["']|["']$/g, '');

        return sanitizedResponse;
    } catch (error) {
        console.error('Error generating content with OpenAI:', error.message);
        throw new Error('Failed to generate content');
    }
};


exports.generateSpeechFromText = async (text, fileName) => {
    const speechFile = path.resolve(`./${fileName}`);
    const optimizedFile = path.resolve(`./optimized-${fileName}`);

    try {
        const mp3 = await openai.audio.speech.create({
            model: "tts-1",
            voice: "alloy",
            input: text
        });

        const buffer = Buffer.from(await mp3.arrayBuffer());
        await fs.promises.writeFile(speechFile, buffer);

        const originalFileSize = fs.statSync(speechFile).size;

        await new Promise((resolve, reject) => {
            ffmpeg(speechFile)
                .setFfmpegPath(ffmpegPath)
                .audioBitrate('48k')
                .save(optimizedFile)
                .on('end', resolve)
                .on('error', reject);
        });

        const optimizedFileSize = fs.statSync(optimizedFile).size;

        const audioUrl = await uploadToR2(optimizedFile, fileName);
        await fs.promises.unlink(speechFile);
        await fs.promises.unlink(optimizedFile);

        console.log(`Original file size: ${originalFileSize} bytes`);
        console.log(`Optimized file size: ${optimizedFileSize} bytes`);

        return {
            audioUrl,
            originalFileSize,
            optimizedFileSize
        };
    } catch (error) {
        console.error('Error generating speech with OpenAI:', error.message);
        if (fs.existsSync(speechFile)) {
            await fs.promises.unlink(speechFile);
        }
        if (fs.existsSync(optimizedFile)) {
            await fs.promises.unlink(optimizedFile);
        }
        throw new Error('Failed to generate speech');
    }
};

// exports.generateSpeechFromText = async (text, fileName) => {
//     const speechFile = path.resolve(`./${fileName}`);
//     try {
//         const mp3 = await openai.audio.speech.create({
//             model: "tts-1",
//             voice: "alloy",
//             input: text 
//         });

//         const buffer = Buffer.from(await mp3.arrayBuffer());
//         await fs.promises.writeFile(speechFile, buffer);

//         const audioUrl = await uploadToR2(speechFile, fileName);
//         await fs.promises.unlink(speechFile);

//         return audioUrl;
//     } catch (error) {
//         console.error('Error generating speech with OpenAI:', error.message);
//         if (fs.existsSync(speechFile)) {
//             await fs.promises.unlink(speechFile);
//         }
//         throw new Error('Failed to generate speech');
//     }
// };

