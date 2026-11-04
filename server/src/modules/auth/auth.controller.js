const { registerUser, loginUser, refreshUserSession, createPasswordReset, resetPassword } = require('./auth.service');
const { sendPasswordResetEmail } = require('./email.service');

const refreshCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  // Vercel and Render are different sites in the current deployment topology.
  // Production cross-site refresh cookies must opt into SameSite=None and Secure.
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    const user = await registerUser({ name, email, password });
    res.status(201).json({ message: 'User registered successfully', user });
  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.message || 'Server error' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const { user, accessToken, refreshToken } = await loginUser({ email, password });

    res.cookie('refreshToken', refreshToken, refreshCookieOptions);

    res.status(200).json({ message: 'Login successful', user, accessToken });
  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.message || 'Server error' });
  }
};

const refresh = async (req, res) => {
  try {
    const session = await refreshUserSession(req.cookies.refreshToken);
    res.cookie('refreshToken', session.refreshToken, refreshCookieOptions);
    res.status(200).json({ user: session.user, accessToken: session.accessToken });
  } catch (err) {
    res.status(err.statusCode || 401).json({ message: 'Unable to restore session' });
  }
};

const logout = (req, res) => {
  res.clearCookie('refreshToken', refreshCookieOptions);
  res.status(204).send();
};

const forgotPassword = async (req, res) => {
  const genericMessage = 'If an account matches that email, a reset link is on its way.';
  try {
    const reset = await createPasswordReset(req.body?.email);
    if (reset) {
      const clientUrl = (process.env.CLIENT_URL || 'http://localhost:5173').split(',')[0].trim();
      const resetUrl = `${clientUrl}/reset-password?token=${encodeURIComponent(reset.rawToken)}`;
      await sendPasswordResetEmail({ email: reset.user.email, name: reset.user.name, resetUrl });
      if (process.env.NODE_ENV === 'test') return res.status(200).json({ message: genericMessage, resetToken: reset.rawToken });
    }
    return res.status(200).json({ message: genericMessage });
  } catch (err) {
    console.error('Password reset request failed:', err.message);
    return res.status(200).json({ message: genericMessage });
  }
};

const completePasswordReset = async (req, res) => {
  try {
    await resetPassword({ token: req.body?.token, password: req.body?.password });
    return res.status(200).json({ message: 'Password updated. You can now sign in.' });
  } catch (err) {
    return res.status(err.statusCode || 400).json({ message: err.message || 'Password could not be reset' });
  }
};

module.exports = { register, login, refresh, logout, forgotPassword, completePasswordReset };
