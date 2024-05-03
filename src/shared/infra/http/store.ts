import { AsyncLocalStorage } from "async_hooks";

import { AdminModel } from "~/modules/admin/infra/persistence/model/admin";
import { CustomerModel } from "~/modules/customer/infra/persistence/model/customer";
import { UserModel } from "~/modules/user/infra/persistence/model/user";

export interface IStore {
  method: string;
  url: string;

  // keep-sorted start
  admin?: AdminModel;
  customer?: CustomerModel;
  user?: UserModel;
}

const storage = new AsyncLocalStorage<IStore>();

export const asyncLocalStorage = {
  async run(store: IStore, cb: () => Promise<void>) {
    return storage.run(store, cb);
  },

  get() {
    return storage.getStore();
  },
};
