import type { Context, Next } from "koa";
import { injectable, inject } from "tsyringe";
import Router from "@koa/router";

import HttpStatus from "~/shared/common/enums/http_status";
import { BaseController } from "~/shared/infra/http/utils/base_controller";
import { UserGetAllUseCase } from "~/modules/user/application/usecase/get_all";
import { UserGetUseCase } from "~/modules/user/application/usecase/get";
import { UserCreateUseCase } from "~/modules/user/application/usecase/create";
import {
  GetAllResponseSchema,
  GetAllResponse,
} from "~/modules/user/infra/http/contract/api";
import { asyncLocalStorage } from "~/shared/infra/http/store";

@injectable()
export class UserController extends BaseController {
  private router: Router;

  constructor(
    @inject(UserGetAllUseCase) private userGetAllUseCase: UserGetAllUseCase,
    @inject(UserGetUseCase) private userGetUseCase: UserGetUseCase,
    @inject(UserCreateUseCase) private userCreateUseCase: UserCreateUseCase
  ) {
    super();
    this.router = new Router();
  }

  register() {
    this.router.get("/", this.getAll);
    this.router.post("/", this.create);

    // resolve :userUuid
    this.router.use("/:userUuid", async (ctx: Context, next: Next) => {
      if (!ctx.params.userUuid) {
        return await next();
      }

      const userUuid = ctx.params.userUuid;
      const user = await this.userGetUseCase.execute(userUuid);

      const store = asyncLocalStorage.get();
      await asyncLocalStorage.run(
        {
          ...store!,
          user,
        },
        next
      );
    });

    this.router.get("/:userId", this.get);

    return this.router;
  }

  getAll = async (ctx: Context) => {
    const users = await this.userGetAllUseCase.execute();

    ctx.status = HttpStatus.OK;
    ctx.body = this.generateResponse<GetAllResponse>(GetAllResponseSchema, {
      users,
    });
  };

  get = async (ctx: Context) => {
    try {
      const user = asyncLocalStorage.get()!.user!;

      ctx.status = HttpStatus.OK;
      ctx.body = {
        user,
      };
    } catch (error) {
      ctx.status = HttpStatus.INTERNAL_SERVER_ERROR;
      ctx.body = {
        error: "An error occurred while retrieving the user.",
      };
    }
  };

  create = async (ctx: ContextRequest) => {
    try {
      const payload = <any>ctx.request.fields;
      const useCase = await this.userCreateUseCase.execute(payload);

      if (useCase.isFail()) {
        ctx.status = HttpStatus.BAD_REQUEST;
        ctx.body = {
          error: useCase.error(),
        };

        return;
      }

      ctx.status = HttpStatus.OK;
      ctx.body = {
        user: useCase.value(),
      };
    } catch (error) {
      console.log("error", error);

      ctx.status = HttpStatus.INTERNAL_SERVER_ERROR;
      ctx.body = {
        error: "An error occurred while creating the user.",
      };
    }
  };
}
