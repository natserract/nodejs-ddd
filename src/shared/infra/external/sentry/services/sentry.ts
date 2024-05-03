import * as Sentry from "@sentry/node";
import { nodeProfilingIntegration } from "@sentry/profiling-node";

import Config from "~/configs";
import type { Config as SentryConfig } from "~/shared/infra/external/sentry/config";
import { useLogger } from "~/shared/packages/logger/logger";

const logger = useLogger("Sentry");

const sentryConfig: SentryConfig = {
  dsn: Config.SENTRY_DSN,
  sendMetadata: false,
  init: {
    tracesSampleRate: 0.2,
    integrations: [
      // enable HTTP calls tracing
      new Sentry.Integrations.Http({ tracing: true }),
      new Sentry.Integrations.Postgres(),
      // Automatically instrument Node.js libraries and frameworks
      ...Sentry.autoDiscoverNodePerformanceMonitoringIntegrations(),
      nodeProfilingIntegration(),
    ],
  },
};

const createSentryService = (config = sentryConfig) => {
  let isReady = false;
  let instance: typeof Sentry | null = null;

  return {
    init() {
      if (instance != null) {
        return this;
      }

      // Don't init Sentry if no DSN was provided
      if (!config.dsn) {
        logger.log("Sentry is disabled because no Sentry DSN was provided");
        return this;
      }

      try {
        Sentry.init({
          dsn: config.dsn,
          environment: Config.APP_ENV,
          ...config.init,
        });

        // Store the successfully initialized Sentry instance
        instance = Sentry;
        isReady = true;
      } catch (error) {
        logger.warn(
          "Could not set up Sentry, make sure you entered a valid DSN",
        );
      }

      return this;
    },
    getInstance() {
      return instance;
    },
    sendError(error: Error, configureScope?: (scope: Sentry.Scope) => void) {
      // Make sure Sentry is ready
      if (!isReady || !instance) {
        logger.warn("Sentry wasn't properly initialized, cannot send event");
        return;
      }

      instance.withScope((scope) => {
        // Configure the Sentry scope using the provided callback
        if (configureScope && config.sendMetadata) {
          configureScope(scope);
        }

        // Actually send the Error to Sentry
        instance?.captureException(error);
      });
    },
  };
};

export default createSentryService;
