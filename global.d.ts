import type * as Koa from "koa";

declare global {
  interface ContextRequest extends Koa.Context {
    request: Koa.Request & {
      fields: {};
    };
  }
}
