import { Aggregate, Result } from "types-ddd";

import { UserCreationAttributes } from "~/modules/user/infra/persistence/model/user";
import { UserAdded } from "~/modules/user/domain/event/user_added";

export class User extends Aggregate<UserCreationAttributes> {
  private constructor(props: UserCreationAttributes) {
    super(props);
  }

  static create(props: UserCreationAttributes): Result<User> {
    const user = new User(props);
    const userAdded = new UserAdded();

    // event is applied to the user object
    user.addEvent(userAdded);

    return Result.Ok(user);
  }
}
