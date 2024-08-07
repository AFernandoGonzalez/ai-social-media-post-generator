const { generateSpeechFromText } = require('../services/aiServices');
const { getPresignedUrl } = require('../services/cloudflareR2Service');
const Audio = require('../models/Audio');

exports.convertTextToSpeech = async (req, res) => {
    const { text } = req.body;
    const userId = req.user.uid;

    if (!text || typeof text !== 'string') {
        return res.status(400).json({ error: 'Valid text is required' });
    }

    try {
        const fileName = `${Date.now()}-speech.mp3`;
        await generateSpeechFromText(text, fileName);

        const audio = new Audio({
            user: userId,
            fileName
        });
        await audio.save();

        const presignedUrl = await getPresignedUrl(fileName);
        res.status(200).json({ audioUrl: presignedUrl });
    } catch (error) {
        console.error('Error converting text to speech:', error.message);
        res.status(500).json({ error: 'Failed to convert text to speech' });
    }
};

exports.getUserAudios = async (req, res) => {
    const userId = req.user.uid;

    try {
        const audios = await Audio.find({ user: userId }).sort({ createdAt: -1 });
        const audiosWithUrls = await Promise.all(
            audios.map(async (audio) => {
                const presignedUrl = await getPresignedUrl(audio.fileName);
                return { ...audio._doc, presignedUrl };
            })
        );

        res.status(200).json(audiosWithUrls);
    } catch (error) {
        console.error('Error fetching user audios:', error.message);
        res.status(500).json({ error: 'Failed to fetch user audios' });
    }
};

exports.getPresignedUrl = async (req, res) => {
    const { fileName } = req.params;

    try {
        const presignedUrl = await getPresignedUrl(fileName);
        res.status(200).json({ presignedUrl });
    } catch (error) {
        console.error('Error generating pre-signed URL:', error.message);
        res.status(500).json({ error: 'Failed to generate pre-signed URL' });
    }
};

exports.updateAudioFileName = async (req, res) => {
    const { id } = req.params;
    const { fileName } = req.body;
    const userId = req.user.uid;

    try {
        const audio = await Audio.findOneAndUpdate(
            { _id: id, user: userId },
            { fileName },
            { new: true }
        );

        if (!audio) {
            return res.status(404).json({ message: 'Audio not found' });
        }

        res.status(200).json({ message: 'Audio updated successfully', audio });
    } catch (error) {
        console.error('Error updating audio:', error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.deleteAudio = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.uid;

    try {
        const audio = await Audio.findOneAndDelete({ _id: id, user: userId });

        if (!audio) {
            return res.status(404).json({ message: 'Audio not found' });
        }

        res.status(200).json({ message: 'Audio deleted successfully' });
    } catch (error) {
        console.error('Error deleting audio:', error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
};
