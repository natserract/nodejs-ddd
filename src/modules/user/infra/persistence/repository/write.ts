import { singleton } from "tsyringe";

import { BaseWriteRepository } from "~/shared/infra/persistence/repository/write";
import { IUserWriteRepository } from "~/modules/user/domain/interface/repository";
import {
  UserModel,
  UserCreationAttributes,
} from "~/modules/user/infra/persistence/model/user";

@singleton()
export class UserWriteRepository extends BaseWriteRepository<
  UserModel,
  UserCreationAttributes
> {
  constructor() {
    super(UserModel);
  }
}
