import { Entity, Result, Ok } from "types-ddd";

import { AdminCreationAttributes } from "~/modules/admin/infra/persistence/model/admin";

export class Admin extends Entity<AdminCreationAttributes> {
  private constructor(props: AdminCreationAttributes) {
    super(props);
  }

  static create(props: AdminCreationAttributes): Result<Admin> {
    return Ok(new Admin(props));
  }
}
