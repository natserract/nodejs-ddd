import type { Context, Next } from "koa";

import { useLogger } from "~/shared/packages/logger/logger";

const koaLogger = async (ctx: Context, next: Next) => {
  const logger = useLogger("Koa Server");

  const start = ctx[Symbol.for("request-received.startTime")]
    ? ctx[Symbol.for("request-received.startTime")].getTime()
    : Date.now();

  logger.log(ctx.method, ctx.originalUrl);

  try {
    await next();
  } catch (err) {
    // log uncaught downstream errors
    logger.error([start, err], `${ctx.method} ${ctx.originalUrl}`);
    throw err;
  }
};

export default koaLogger;
