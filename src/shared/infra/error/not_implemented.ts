import { ApplicationError } from "~/shared/infra/error/application";

export class NotImplementedError<
  TMessage extends string = string,
  TDetails = unknown,
> extends ApplicationError<"NotImplementedError", TMessage, TDetails> {
  constructor(
    message = "This feature is not implemented yet" as TMessage,
    details?: TDetails,
  ) {
    super(message, details);
    this.name = "NotImplementedError";
    this.message = message;
  }
}
