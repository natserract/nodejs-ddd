import { ApplicationError } from "~/shared/infra/error/application";

export class ValidationError<
  TMessage extends string = string,
  TDetails = unknown,
> extends ApplicationError<"ValidationError", TMessage, TDetails> {
  constructor(message: TMessage, details?: TDetails) {
    super(message, details);
    this.name = "ValidationError";
  }
}
