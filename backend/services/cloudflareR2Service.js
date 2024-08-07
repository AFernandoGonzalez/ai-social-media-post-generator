const { S3Client, PutObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

const s3Client = new S3Client({
    region: 'auto',
    endpoint: process.env.CLOUDFLARE_ENDPOINT,
    credentials: {
        accessKeyId: process.env.CLOUDFLARE_ACCESS_KEY_ID,
        secretAccessKey: process.env.CLOUDFLARE_SECRET_ACCESS_KEY,
    },
    forcePathStyle: true,
});

const uploadToR2 = async (buffer, fileName) => {
    const params = {
        Bucket: process.env.CLOUDFLARE_BUCKET_NAME,
        Key: fileName,
        Body: buffer,
        ContentType: 'audio/mp3'
    };

    const command = new PutObjectCommand(params);
    await s3Client.send(command);

    console.log(`File uploaded: ${fileName}`);
    return `${process.env.CLOUDFLARE_ENDPOINT}/${process.env.CLOUDFLARE_BUCKET_NAME}/${fileName}`;
};

const getPresignedUrl = async (fileName) => {
    const command = new GetObjectCommand({
        Bucket: process.env.CLOUDFLARE_BUCKET_NAME,
        Key: fileName,
    });

    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

    // console.log(`Generated pre-signed URL: ${signedUrl}`);
    return signedUrl;
};

module.exports = { uploadToR2, getPresignedUrl };
