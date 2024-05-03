import { ApplicationError } from "~/shared/infra/error/application";

export class AggregateNotFound<
  TName extends string = "AggregateNotFound",
  TMessage extends string = string,
  TDetails = unknown,
> extends ApplicationError<TName, TMessage, TDetails> {
  constructor(
    message = "Requested aggregate does not exist" as TMessage,
    details?: TDetails,
  ) {
    super(message, details);
    this.name = "AggregateNotFound" as TName;
    this.message = message;
  }
}
