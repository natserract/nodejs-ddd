import { singleton } from "tsyringe";

import { BaseWriteRepository } from "~/shared/infra/persistence/repository/write";
import { ICustomerWriteRepository } from "~/modules/customer/domain/interface/repository";
import {
  CustomerModel,
  CustomerCreationAttributes,
} from "~/modules/customer/infra/persistence/model/customer";

@singleton()
export class CustomerWriteRepository
  extends BaseWriteRepository<CustomerModel, CustomerCreationAttributes>
  implements ICustomerWriteRepository
{
  constructor() {
    super(CustomerModel);
  }
}
