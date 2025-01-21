import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import createHttpError from 'http-errors';

// Обчислення абсолютного шляху
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Перетворення шляху у формат file://
const sessionPath = pathToFileURL(path.resolve(__dirname, '../db/models/session.js')).href;
const userPath = pathToFileURL(path.resolve(__dirname, '../db/models/user.js')).href;

// Динамічний імпорт модулів
const { SessionCollection } = await import(sessionPath);
const { UsersCollection } = await import(userPath);

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.get('Authorization');

    if (!authHeader) {
      throw createHttpError(401, 'Please, provide Authorization header');
    }

    const [bearer, token] = authHeader.split(' ');

    if (bearer !== 'Bearer' || !token) {
      throw createHttpError(401, 'Auth header should be of type Bearer');
    }

    const session = await SessionCollection.findOne({ accessToken: token });

    if (!session) {
      throw createHttpError(401, 'Session not found');
    }

    const isExpiredToken = new Date() > new Date(session.accessTokenValidUntil);

    if (isExpiredToken) {
      throw createHttpError(401, 'Access token expired');
    }

    const user = await UsersCollection.findOne({ _id: session.userId });

    if (!user) {
      throw createHttpError(401, 'User not found');
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};
