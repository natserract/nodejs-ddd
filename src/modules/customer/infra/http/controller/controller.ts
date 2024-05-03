import type { Context } from "koa";
import { injectable } from "tsyringe";
import Router from "@koa/router";

import HttpStatus from "~/shared/common/enums/http_status";
import { BaseController } from "~/shared/infra/http/utils/base_controller";

@injectable()
export class CustomerController extends BaseController {
  private router: Router;

  constructor() {
    super();
    this.router = new Router();
  }

  register() {
    this.router.post("/", this.create);
    return this.router;
  }

  create = async (ctx: Context) => {
    ctx.status = HttpStatus.OK;
    ctx.body = {
      data: "Created",
    };
  };
}
