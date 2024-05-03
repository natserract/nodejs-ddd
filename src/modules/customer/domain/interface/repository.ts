import { Customer } from "~/modules/customer/domain/entity/customer";
import { CustomerModel } from "~/modules/customer/infra/persistence/model/customer";

export interface ICustomerCreateRepository {
  save(customer: Customer): Promise<CustomerModel>;
}

export interface ICustomerWriteRepository extends ICustomerCreateRepository {}
