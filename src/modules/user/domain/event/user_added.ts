import { EventHandler } from "types-ddd";

import { User } from "~/modules/user/domain/entity/user";

export class UserAdded extends EventHandler<User> {
  static readonly NAME = "user_added";
  $names = UserAdded.NAME;
  $version = 0;

  constructor() {
    super({
      eventName: UserAdded.NAME,
    });
  }

  async dispatch(aggregate: User) {
    const model = aggregate.toObject();
    console.log("User Added", model);
  }
}
