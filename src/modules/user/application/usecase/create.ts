import { injectable, inject } from "tsyringe";
import { IUseCase, Result } from "types-ddd";
import { fromZodError } from "zod-validation-error";
import { Transaction as TransactionSequelize } from "sequelize";

import Config from "~/configs";

import { User } from "~/modules/user/domain/entity/user";
import {
  CreateUserDTO,
  CreateUserDTOSchema,
} from "~/modules/user/application/dto/dto";
import { UserWriteRepository } from "~/modules/user/infra/persistence/repository/write";
import { UserReadRepository } from "~/modules/user/infra/persistence/repository/read";
import { Customer } from "~/modules/customer/domain/entity/customer";
import { CustomerModel } from "~/modules/customer/infra/persistence/model/customer";
import { CustomerWriteRepository } from "~/modules/customer/infra/persistence/repository/write";
import { BaseWriteRepository } from "~/shared/infra/persistence/repository/write";
import { Admin } from "~/modules/admin/domain/entity/admin";
import { CustomerCreationAttributes } from "~/modules/customer/infra/persistence/model/customer";
import { AdminCreationAttributes } from "~/modules/admin/infra/persistence/model/admin";
import { UserModel } from "~/modules/user/infra/persistence/model/user";
import { UserAdded } from "~/modules/user/domain/event/user_added";

import type { IUserCreateRepository } from "~/modules/user/domain/interface/repository";

import { ValidationError, NotImplementedError } from "~/shared/infra/error";

@injectable()
export class UserCreateUseCase
  implements IUseCase<CreateUserDTO, Result<UserModel, string>>
{
  constructor(
    @inject(UserReadRepository)
    private userReadRepository: UserReadRepository,
    @inject(UserWriteRepository)
    private userWriteRepository: IUserCreateRepository,
    @inject(CustomerWriteRepository)
    private customerWriteRepository: CustomerWriteRepository,
  ) {}

  async execute(
    dto: CreateUserDTO,
    isCreateForAdmin = false,
    parentTransaction?: TransactionSequelize,
  ): Promise<Result<UserModel, string>> {
    const schema = CreateUserDTOSchema.safeParse(dto);

    const isValidProps = schema.success;
    if (!isValidProps) {
      const validationError = fromZodError(schema.error);
      return Result.fail(validationError.toString());
    }

    // Check if user with the same email/phone already exists
    const existingUser = await this.userReadRepository.firstAny({
      email: dto.email,
      phone: dto.phone,
    });

    if (existingUser) {
      throw new ValidationError(
        "duplicate_customer",
        "A user with that email and phone already exists",
      );
    }

    return BaseWriteRepository.beginTransaction(
      { t: parentTransaction },
      async (t) => {
        const user = User.create({
          email: dto.email,
          password: dto.password,
          phone: dto.phone,
        });

        // Dispatched event
        user.value().dispatchEvent(UserAdded.NAME);

        const createdUser = await this.userWriteRepository.save(
          user.value(),
          t,
        );
        const createdUserId = createdUser.id;

        if (!isCreateForAdmin) {
          await this.createCustomer(createdUserId, dto, t);
        } else if (Config.APP_ENV !== "production") {
          await this.createAdmin(createdUserId, dto, t);
        }

        return Result.Ok(createdUser);
      },
    );
  }

  protected async createCustomer(
    userId: string,
    payload: Omit<CustomerCreationAttributes, "userId">,
    parentTransaction: TransactionSequelize,
  ): Promise<Result<CustomerModel>> {
    const customer = Customer.create({
      ...payload,
      userId,
    });
    const createdCustomer = await this.customerWriteRepository.save(
      customer.value(),
      parentTransaction,
    );
    return Result.Ok(createdCustomer);
  }

  protected async createAdmin(
    userId: string,
    payload: Omit<AdminCreationAttributes, "userId">,
    parentTransaction: TransactionSequelize,
  ): Promise<Result<Admin>> {
    throw new NotImplementedError("Create admin is not implemented yet");
  }
}
