import * as Sentry from "@sentry/node";
import { stripUrlQueryAndFragment } from "@sentry/utils";
import type { Context, Next } from "koa";

import Config from "~/configs";
import createSentryService from "~/shared/infra/external/sentry/services/sentry";
import { useLogger } from "~/shared/packages/logger/logger";

const logger = useLogger("Sentry");

const sentryMiddleware = async (ctx: Context, next: Next) => {
  const sentryService: ReturnType<typeof createSentryService> =
    createSentryService();

  sentryService.init();
  const sentry = sentryService.getInstance();

  if (!sentry) {
    logger.warn("No Sentry DSN provided!");

    // initialization failed
    await next();
    return;
  }

  const reqMethod = (ctx.method || "").toUpperCase();
  const reqUrl = ctx.url && stripUrlQueryAndFragment(ctx.url);

  try {
    await next();
  } catch (error) {
    logger.log("Error", error);

    if (error instanceof Error) {
      sentryService.sendError(error, (scope: Sentry.Scope) => {
        scope.addEventProcessor((event) => {
          // Parse Koa context to add error metadata
          return sentry.Handlers.parseRequest(
            event,
            ctx.request as Sentry.Request,
            {
              // Don't parse the transaction name, we'll do it manually
              transaction: false,
            }
          );
        });

        // Manually add transaction name
        scope.setTag(
          "transaction",
          `${reqMethod} ${reqUrl} ${ctx._matchedRoute}`
        );
        scope.setTag("url", reqUrl);
        scope.setTag("method", reqMethod);
        scope.setTag("environment", Config.APP_ENV);
        scope.setTag("ip_address", ctx.request.ip);
        scope.setTag("user_agent", ctx.get("User-Agent"));
      });
    }

    throw error;
  }
};

export default sentryMiddleware;
