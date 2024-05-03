export class ApplicationError<
  TName extends string = "ApplicationError",
  TMessage extends string = string,
  TDetails = unknown,
> extends Error {
  name: TName;

  details: TDetails;

  message: TMessage;

  constructor(
    message = "An application error occured" as TMessage,
    details: TDetails = {} as TDetails,
  ) {
    super();
    this.name = "ApplicationError" as TName;
    this.message = message;
    this.details = details;
  }
}
