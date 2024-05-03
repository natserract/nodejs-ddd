import { ApplicationError } from "~/shared/infra/error/application";

export class NotFoundError<
  TMessage extends string = string,
  TDetails = unknown,
> extends ApplicationError<"NotFoundError", TMessage, TDetails> {
  constructor(message = "Entity not found" as TMessage, details?: TDetails) {
    super(message, details);
    this.name = "NotFoundError";
    this.message = message;
  }
}
