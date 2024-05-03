import { injectable, inject } from "tsyringe";
import { IUseCase } from "types-ddd";

import { UserModel } from "~/modules/user/infra/persistence/model/user";
import { UserReadRepository } from "~/modules/user/infra/persistence/repository/read";
import type { IUserGetByIdRepository } from "~/modules/user/domain/interface/repository";

@injectable()
export class UserGetUseCase implements IUseCase<unknown, UserModel> {
  constructor(
    @inject(UserReadRepository) private repository: IUserGetByIdRepository,
  ) {}

  async execute(userUuid: string): Promise<UserModel> {
    const users = await this.repository.getByUserUuid(userUuid);
    return users;
  }
}
