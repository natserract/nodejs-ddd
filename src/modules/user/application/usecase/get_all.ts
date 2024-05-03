import { injectable, inject } from "tsyringe";
import { IUseCase } from "types-ddd";

import { UserModel } from "~/modules/user/infra/persistence/model/user";
import { UserReadRepository } from "~/modules/user/infra/persistence/repository/read";
import type { IUserGetAllRepository } from "~/modules/user/domain/interface/repository";

@injectable()
export class UserGetAllUseCase implements IUseCase<unknown, UserModel[]> {
  constructor(
    @inject(UserReadRepository) private repository: IUserGetAllRepository,
  ) {}

  async execute(): Promise<UserModel[]> {
    const users = await this.repository.getAll();
    return users;
  }
}
