import os from "os";
import Koa from "koa";
import body from "koa-better-body";
import type { Context, Next } from "koa";
import { v4 as uuidv4 } from "uuid";

import context from "~/shared/infra/http/middleware/context";
import cors from "~/shared/infra/http/middleware/cors";
import security from "~/shared/infra/http/middleware/security";
import logger from "~/shared/infra/http/middleware/logger";
import sentry from "~/shared/infra/external/sentry";

const registerApplicationMiddlewares = async (app: Koa) => {
  app
    .use(context)
    .use(security)
    .use(body())
    .use(cors)
    .use(logger)
    .use(sentry.middleware)
    .use(async (ctx: Context, next: Next) => {
      const reqId = `${os.hostname}-${uuidv4()}`;
      ctx.set("App-X-RequestId", reqId);
      ctx.state.requestId = reqId;
      await next();
    });
};

export default registerApplicationMiddlewares;
