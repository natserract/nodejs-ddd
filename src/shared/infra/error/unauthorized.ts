import { ApplicationError } from "~/shared/infra/error/application";

export class UnauthorizedError<
  TMessage extends string = string,
  TDetails = unknown,
> extends ApplicationError<"UnauthorizedError", TMessage, TDetails> {
  constructor(message = "Unauthorized" as TMessage, details?: TDetails) {
    super(message, details);
    this.name = "UnauthorizedError";
    this.message = message;
  }
}
