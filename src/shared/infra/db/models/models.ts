import { AdminModel } from "~/modules/admin/infra/persistence/model/admin";
import { CustomerModel } from "~/modules/customer/infra/persistence/model/customer";
import { UserModel } from "~/modules/user/infra/persistence/model/user";

import { connection } from "~/shared/infra/db/config/config";

const sequelize = connection.sequelize;

export const models: Record<string, any> = {
  AdminModel,
  CustomerModel,
  UserModel,
};

export const initModels = async (withoutSync = false) => {
  // Create the relationships for the models;
  Object.keys(models).forEach((modelName) => {
    if (models[modelName].associate) {
      models[modelName].associate(models);
    }

    // Create model associations
    if (
      "associate" in models[modelName].prototype &&
      !Object.keys(models[modelName].associations).length
    ) {
      models[modelName].prototype.associate(models);
    }
  });

  if (!withoutSync) {
    await sequelize.sync();
  }
};
