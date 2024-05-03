import koaCors from "@koa/cors";
import type { Context, Next } from "koa";

const defaultConfig = {
  origin: "*",
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"],
  expose: ["App-X-Access-Token", "App-X-Session-Token"],
};

const cors = async (ctx: Context, next: Next) => {
  const { origin, credentials, methods, expose } = defaultConfig;

  return koaCors({
    origin: (ctx) => {
      const whitelist: string[] = [origin];

      const requestOrigin = ctx.headers.origin ?? "";
      if (whitelist.includes("*")) {
        return credentials ? requestOrigin : "*";
      }

      if (!whitelist.includes(requestOrigin)) {
        return ctx.throw(`${requestOrigin} is not a valid origin`);
      }
      return requestOrigin;
    },
    credentials,
    allowMethods: methods,
    exposeHeaders: expose,
  })(ctx, next);
};

export default cors;
