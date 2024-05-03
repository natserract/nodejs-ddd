import Router from "@koa/router";

import v1Router from "~/shared/infra/http/controller/public/v1";

const router = new Router();

router.use("/public/v1", v1Router.routes(), v1Router.allowedMethods());

export default router;
