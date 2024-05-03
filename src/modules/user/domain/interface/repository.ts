import { Aggregate } from "types-ddd";
import { Transaction as TransactionSequelize } from "sequelize";

import { User } from "~/modules/user/domain/entity/user";
import {
  UserModel,
  UserCreationAttributes,
} from "~/modules/user/infra/persistence/model/user";

export interface IUserGetAllRepository {
  getAll(): Promise<UserModel[]>;
}

export interface IUserGetByIdRepository {
  getByUserUuid(userUuid: string): Promise<UserModel>;
}

export interface IUserReadRepository
  extends IUserGetAllRepository,
    IUserGetByIdRepository {}

export interface IUserCreateRepository {
  getById(id: Aggregate<UserCreationAttributes>["id"]): Promise<UserModel>;
  save(
    user: User,
    parentTransaction?: TransactionSequelize
  ): Promise<UserModel>;
}

export interface IUserWriteRepository extends IUserCreateRepository {}
