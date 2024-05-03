import { EventHandler } from "types-ddd";

import { Customer } from "~/modules/customer/domain/entity/customer";

export class CustomerUserCreated extends EventHandler<Customer> {
  static readonly NAME = "customer_user_created";
  $names = CustomerUserCreated.NAME;
  $version = 0;

  constructor() {
    super({
      eventName: CustomerUserCreated.NAME,
    });
  }

  async dispatch(aggregate: Customer) {
    const model = aggregate.toObject();
    console.log("Customer User Created", model);
  }
}
