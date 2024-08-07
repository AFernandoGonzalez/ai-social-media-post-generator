const { createOpenAI } = require('@ai-sdk/openai');
const { streamText } = require('ai');
const { uploadToR2 } = require('./cloudflareR2Service');
const OpenAI = require('openai');
const openai = new OpenAI();
const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('ffmpeg-static');
const { Readable } = require('stream');

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

        const sanitizedResponse = fullResponse.replace(/^["']|["']$/g, '');

        return sanitizedResponse;
    } catch (error) {
        console.error('Error generating content with OpenAI:', error.message);
        throw new Error('Failed to generate content');
    }
};

exports.generateSpeechFromText = async (text, fileName) => {
    try {
        const mp3 = await openai.audio.speech.create({
            model: "tts-1",
            voice: "alloy",
            input: text
        });

        const buffer = Buffer.from(await mp3.arrayBuffer());

        const optimizedBuffer = await new Promise((resolve, reject) => {
            const command = ffmpeg()
                .input(Readable.from(buffer))
                .setFfmpegPath(ffmpegPath)
                .audioBitrate('48k')
                .format('mp3')
                .on('error', reject);

            const chunks = [];
            command.pipe().on('data', chunk => chunks.push(chunk)).on('end', () => resolve(Buffer.concat(chunks)));
        });

        const originalFileSize = buffer.length;
        const optimizedFileSize = optimizedBuffer.length;

        const audioUrl = await uploadToR2(optimizedBuffer, fileName);

        console.log(`Original file size: ${originalFileSize} bytes`);
        console.log(`Optimized file size: ${optimizedFileSize} bytes`);

        return {
            audioUrl,
            originalFileSize,
            optimizedFileSize
        };
    } catch (error) {
        console.error('Error generating speech with OpenAI:', error.message);
        throw new Error('Failed to generate speech');
    }
};
