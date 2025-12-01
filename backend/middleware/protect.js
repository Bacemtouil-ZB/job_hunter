import User from '../models/UserModel.js';

const protect = async (req, res, next) => {
  try {
    if (!req.oidc.isAuthenticated()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const auth0Id = req.oidc.user.sub;
    const user = await User.findOne({ auth0Id });

    if (!user) {
      return res.status(404).json({ message: 'User not found in database' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Protection middleware error:', error);
    res.status(500).json({ message: 'Authentication error' });
  }
};

export default protect;