import { ApplicationError } from "~/shared/infra/error/application";

export class StateError<
  TMessage extends string = string,
  TDetails = unknown,
> extends ApplicationError<"StateError", TMessage, TDetails> {
  constructor(message = "Invalid state" as TMessage, details?: TDetails) {
    super(message, details);
    this.name = "StateError";
    this.message = message;
  }
}
