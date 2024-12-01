import bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import createHttpError from 'http-errors';
import { FIFTEEN_MINUTES, THIRTY_DAYS } from '../constants/users.js';
import SessionsCollection from '../db/models/Session.js';
import UsersCollection from '../db/models/User.js';

const createSession = () => {
  const accessToken = randomBytes(30).toString('base64'); // створила токени
  const refreshToken = randomBytes(30).toString('base64');
  return {
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + THIRTY_DAYS),
  };
};

export const registerUser = async (payload) => {
  const user = await UsersCollection.findOne({ email: payload.email });
  if (user) throw createHttpError(409, 'Email in use');

  const encryptedPassword = await bcrypt.hash(payload.password, 10);

  return await UsersCollection.create({
    ...payload,
    password: encryptedPassword,
  });
};

export const loginUser = async (payload) => {
  const user = await UsersCollection.findOne({ email: payload.email });
  if (!user) throw createHttpError(404, 'User not found');
  const isEqual = await bcrypt.compare(payload.password, user.password);

  if (!isEqual) {
    throw createHttpError(401, 'Unauthorized');
  }

  await SessionsCollection.deleteOne({
    userId: user._id,
  });

  const newSession = createSession();

  return await SessionsCollection.create({
    userId: user._id,
    ...newSession,
  });
};

export const refreshUserSession = async ({ sessionId, refreshToken }) => {
  const session = await SessionsCollection.findOne({
    _id: sessionId,
    refreshToken,
  });
  if (!session) {
    throw createHttpError(401, 'Session not found');
  }
  if (Date.now() > session.refreshTokenValidUntil) {
    throw createHttpError(401, 'Session token expired');
  }

  await SessionsCollection.deleteOne({
    userId: session.userId,
  });

  const newSession = createSession();

  return SessionsCollection.create({
    userId: session.userId,
    ...newSession,
  });
};

export const logout = (sessionId) =>
  SessionsCollection.deleteOne({ _id: sessionId });

export const findSession = (filter) => SessionsCollection.findOne(filter);

export const findUser = (filter) => UsersCollection.findOne(filter);
