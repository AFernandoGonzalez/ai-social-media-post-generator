const { generateSpeechFromText } = require('../services/aiServices');
const { getPresignedUrl, renameFileInR2, deleteFromR2 } = require('../services/cloudflareR2Service');
const Audio = require('../models/Audio');

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

exports.convertTextToSpeech = async (req, res) => {
    const { text, title } = req.body;
    const userId = req.user.uid;

    if (!text || typeof text !== 'string') {
        return res.status(400).json({ error: 'Valid text is required' });
    }

    if (!title || typeof title !== 'string') {
        return res.status(400).json({ error: 'Valid title is required' });
    }

    try {
        const fileName = `${title}`;
        await generateSpeechFromText(text, fileName);

        const audio = new Audio({
            user: userId,
            fileName,
            title
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

exports.updateAudioFileName = async (req, res) => {
    const { id } = req.params;
    const { title } = req.body;
    const userId = req.user.uid;

    if (!title || typeof title !== 'string') {
        return res.status(400).json({ error: 'Valid title is required' });
    }

    try {
        const audio = await Audio.findOne({ _id: id, user: userId });

        if (!audio) {
            return res.status(404).json({ message: 'Audio not found' });
        }

        const newFileName = `${title}`;

        // Rename the file in the storage
        await renameFileInR2(audio.fileName, newFileName);

        audio.fileName = newFileName;
        audio.title = title;
        await audio.save();

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

        // Delete the file from R2 storage
        await deleteFromR2(audio.fileName);

        res.status(200).json({ message: 'Audio deleted successfully' });
    } catch (error) {
        console.error('Error deleting audio:', error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
};
