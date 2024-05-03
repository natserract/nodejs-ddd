import config from "~/shared/infra/external/sentry/config";
import middleware from "~/shared/infra/external/sentry/middlewares/sentry";
import services from "~/shared/infra/external/sentry/services/sentry";

export default {
  config,
  middleware,
  services,
};
