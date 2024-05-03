import { Entity, Result, Ok } from "types-ddd";

import { CustomerCreationAttributes } from "~/modules/customer/infra/persistence/model/customer";

export class Customer extends Entity<CustomerCreationAttributes> {
  private constructor(props: CustomerCreationAttributes) {
    super(props);
  }

  static create(props: CustomerCreationAttributes): Result<Customer> {
    return Ok(new Customer(props));
  }
}
