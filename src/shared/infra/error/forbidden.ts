import { ApplicationError } from "~/shared/infra/error/application";

export class ForbiddenError<
  TName extends string = "ForbiddenError",
  TMessage extends string = string,
  TDetails = unknown,
> extends ApplicationError<TName, TMessage, TDetails> {
  constructor(message = "Forbidden access" as TMessage, details?: TDetails) {
    super(message, details);
    this.name = "ForbiddenError" as TName;
    this.message = message;
  }
}
