import { EventHandler } from "types-ddd";

import { Admin } from "~/modules/admin/domain/entity/admin";

export class AdminUserCreated extends EventHandler<Admin> {
  static readonly NAME = "admin_user_created";
  $names = AdminUserCreated.NAME;
  $version = 0;

  constructor() {
    super({
      eventName: AdminUserCreated.NAME,
    });
  }

  async dispatch(aggregate: Admin) {
    const model = aggregate.toObject();
    console.log("Admin User Created", model);
  }
}
