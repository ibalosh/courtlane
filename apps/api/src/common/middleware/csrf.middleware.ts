import { Injectable, NestMiddleware } from '@nestjs/common';
import type { NextFunction, Request, Response } from 'express';
import { env } from '../../config/env';

const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);
const ALLOWED_ORIGINS = new Set([env.webAppUrl]);

@Injectable()
export class CsrfMiddleware implements NestMiddleware {
  use(request: Request, response: Response, next: NextFunction) {
    if (SAFE_METHODS.has(request.method)) {
      next();
      return;
    }

    const origin = request.get('origin');

    if (origin && ALLOWED_ORIGINS.has(origin)) {
      next();
      return;
    }

    const referer = request.get('referer');
    if (referer) {
      try {
        const refererOrigin = new URL(referer).origin;
        if (ALLOWED_ORIGINS.has(refererOrigin)) {
          next();
          return;
        }
      } catch {
        response.status(403).json({
          message: 'Invalid referer header',
        });
        return;
      }
    }

    // Non-browser clients may omit both headers entirely, so only reject
    // requests that present an explicit cross-site Origin/Referer.
    if (!origin && !referer) {
      next();
      return;
    }

    response.status(403).json({
      message: 'Invalid request origin',
    });
  }
}
