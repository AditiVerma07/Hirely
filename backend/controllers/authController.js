const bcrypt = require('bcryptjs');
const User = require('../models/User');
const {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} = require('../services/tokenService');

const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days, matches refresh token expiry
};

async function register(req, res) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'name, email, and password are required' });
    }

    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ message: 'Email already registered' });

    const user = await User.create({ name, email, password });
    await issueTokens(user._id, res);

    res.status(201).json({ id: user._id, name: user.name, email: user.email });
  } catch (err) {
    res.status(500).json({ message: 'Registration failed', error: err.message });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const accessToken = await issueTokens(user._id, res);
    res.json({ accessToken, id: user._id, name: user.name, email: user.email });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
}

async function refresh(req, res) {
  try {
    const token = req.cookies?.refreshToken;
    if (!token) return res.status(401).json({ message: 'No refresh token' });

    const payload = verifyRefreshToken(token);
    const user = await User.findById(payload.sub).select('+refreshTokenHash');

    // Compare against the stored hash so a stolen-but-rotated-out token can't be reused
    const isValid = user?.refreshTokenHash && (await bcrypt.compare(token, user.refreshTokenHash));
    if (!isValid) return res.status(401).json({ message: 'Refresh token invalid or rotated' });

    const accessToken = await issueTokens(user._id, res);
    res.json({ accessToken });
  } catch (err) {
    res.status(401).json({ message: 'Could not refresh session' });
  }
}

async function logout(req, res) {
  const token = req.cookies?.refreshToken;

  if (token) {
    try {
      const payload = verifyRefreshToken(token);
      await User.findByIdAndUpdate(payload.sub, { $unset: { refreshTokenHash: 1 } });
    } catch {
      // token already invalid — nothing to clean up
    }
  }

  res.clearCookie('refreshToken', REFRESH_COOKIE_OPTIONS);
  res.status(204).send();
}

// Issues a fresh access+refresh pair, stores the refresh token's hash (never the raw
// token) so a DB leak alone can't be used to forge sessions, and sets the cookie.
async function issueTokens(userId, res) {
  const accessToken = signAccessToken(userId);
  const refreshToken = signRefreshToken(userId);
  const refreshTokenHash = await bcrypt.hash(refreshToken, 10);

  await User.findByIdAndUpdate(userId, { refreshTokenHash });
  res.cookie('refreshToken', refreshToken, REFRESH_COOKIE_OPTIONS);

  return accessToken;
}

module.exports = { register, login, refresh, logout };