import { EventHandler } from "types-ddd";

import { User } from "~/modules/user/domain/entity/user";

export class UserUpdated extends EventHandler<User> {
  static readonly NAME = "user_updated";
  $names = UserUpdated.NAME;
  $version = 0;

  constructor() {
    super({
      eventName: UserUpdated.NAME,
    });
  }
  async dispatch(aggregate: User) {
    const model = aggregate.toObject();
    console.log("User Updated", model);
  }
}
