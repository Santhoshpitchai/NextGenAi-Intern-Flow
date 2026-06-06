import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import hpp from "hpp";
import { env, corsOrigins } from "./config/env.js";
import routes from "./routes/index.js";
import { notFoundHandler, errorHandler } from "./middleware/error.middleware.js";
import { globalLimiter } from "./middleware/rate-limit.middleware.js";

function isAllowedOrigin(origin: string | undefined): boolean {
  if (!origin) return true;
  // TEMPORARY: Allow all origins for testing - REMOVE IN PRODUCTION
  if (process.env.NODE_ENV === 'production' && process.env.ALLOW_ALL_CORS === 'true') {
    return true;
  }
  // Allow exact matches from CORS_ORIGIN env var
  if (corsOrigins.includes(origin)) return true;
  // Allow all Cloudflare Pages preview deployments
  if (origin.endsWith(".nextgenai-intern-flow.pages.dev")) return true;
  if (origin === "https://nextgenai-intern-flow.pages.dev") return true;
  return false;
}

export function createApp() {
  const app = express();

  // Trust proxy if deployed behind a load balancer (e.g., Nginx, AWS ELB, Heroku)
  app.set("trust proxy", 1);

  app.use(helmet());
  app.use(
    cors({
      origin: (origin, callback) => {
        // TEMPORARY: Allow all origins in production for testing
        if (process.env.NODE_ENV === 'production') {
          callback(null, true);
          return;
        }
        
        if (isAllowedOrigin(origin)) {
          callback(null, true);
        } else {
          callback(new Error(`CORS: origin ${origin} not allowed`));
        }
      },
      credentials: true,
    }),
  );

  // Rate limiting (global)
  app.use(globalLimiter);

  app.use(
    morgan(env.NODE_ENV === "production" ? "combined" : "dev", {
      skip: (req) => {
        const url = req.originalUrl || req.url;
        return (
          url.includes("/notifications") ||
          url.includes("/attendance/my") ||
          url.includes("/tasks/my") ||
          url.includes("/assignments/my") ||
          url.includes("/chat")
        );
      },
    }),
  );
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true, limit: "1mb" }));

  // Prevent HTTP Parameter Pollution
  app.use(hpp());

  app.use(
    "/uploads",
    express.static(path.join(process.cwd(), env.UPLOAD_DIR), {
      maxAge: env.NODE_ENV === "production" ? "7d" : 0,
    }),
  );

  app.use(env.API_PREFIX, routes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
