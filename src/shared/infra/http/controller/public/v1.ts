import Router from "@koa/router";
import { container } from "tsyringe";

import { CustomerController } from "~/modules/customer/infra/http/controller/controller";
import { UserController } from "~/modules/user/infra/http/controller/controller";

const router = new Router();

// Resolve routers
const usersRouter = container.resolve(UserController).register();
const customersRouter = container.resolve(CustomerController).register();

// Routes
router.use("/users", usersRouter.routes(), usersRouter.allowedMethods());
router.use(
  "/customers",
  customersRouter.routes(),
  customersRouter.allowedMethods(),
);

export default router;
