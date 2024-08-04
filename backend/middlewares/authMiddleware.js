const { admin } = require('../config/firebase');

const authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.split('Bearer ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = { uid: decodedToken.uid }; 
    next();
  } catch (error) {
    console.error('Error verifying auth token', error);
    res.status(403).json({ message: 'Could not verify token' });
  }
};

module.exports = authenticate;
