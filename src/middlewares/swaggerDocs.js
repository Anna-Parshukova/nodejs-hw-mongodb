import createHttpError from 'http-errors';
import swaggerUI from 'swagger-ui-express';
import fs from 'node:fs';
import path from 'node:path';

import { SWAGGER_PATH } from '../constants/index.js';

export const swaggerDocs = () => {
  try {
    const swaggerDoc = JSON.parse(fs.readFileSync(SWAGGER_PATH, 'utf-8'));
    return (req, res, next) => {
      if (req.url === '/') {
        swaggerUI.setup(swaggerDoc)(req, res, next);
      } else {
        swaggerUI.serve(req, res, next);
      }
    };
  } catch (error) {
    console.error("Swagger docs loading error:", error.message);
    return (req, res, next) =>
      next(createHttpError(500, "Can't load swagger docs"));
  }
};
