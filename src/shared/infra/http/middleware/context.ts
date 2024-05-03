import type { Context, Next } from "koa";
import { asyncLocalStorage } from "~/shared/infra/http/store";

const requestCtxMiddleware = async (ctx: Context, next: Next) => {
  await asyncLocalStorage.run(ctx, () => next());
};

export default requestCtxMiddleware;
