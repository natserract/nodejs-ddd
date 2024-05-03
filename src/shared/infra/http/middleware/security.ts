import helmet, { KoaHelmet } from "koa-helmet";
import type { Context, Next } from "koa";

export type Config = NonNullable<Parameters<KoaHelmet>[0]>;

const security = (ctx: Context, next: Next) => {
  const helmetConfig: Config = {
    crossOriginEmbedderPolicy: false,
    crossOriginOpenerPolicy: false,
    crossOriginResourcePolicy: false,
    originAgentCluster: false,
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        "connect-src": ["'self'", "https:"],
        "img-src": ["'self'", "data:", "blob:"],
        "media-src": ["'self'", "data:", "blob:"],
        upgradeInsecureRequests: null,
      },
    },
    xssFilter: false,
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
    },
    frameguard: {
      action: "sameorigin",
    },
  };
  return helmet(helmetConfig)(ctx, next);
};

export default security;
