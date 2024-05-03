import Koa from "koa";

import publicRouter from "~/shared/infra/http/controller/public/";

const registerApplicationRouters = async (app: Koa) => {
  app.use(publicRouter.routes());
  app.use(publicRouter.allowedMethods());
};

export default registerApplicationRouters;
