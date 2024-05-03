import { DataTypes, Model, NonAttribute, CreationOptional } from "sequelize";

import { connection } from "~/shared/infra/db/config/config";
import { IAdminAttributes } from "~/modules/admin/domain/interface/admin";
import { UserModel } from "~/modules/user/infra/persistence/model/user";

const sequelize = connection.sequelize;

export interface AdminAttributes extends IAdminAttributes {}

export interface AdminCreationAttributes extends Omit<AdminAttributes, "id"> {}

export class AdminModel
  extends Model<AdminAttributes, AdminCreationAttributes>
  implements AdminAttributes
{
  declare id: CreationOptional<string>;
  declare userId: string;

  // Associations
  declare User?: NonAttribute<UserModel>;

  // Timestamps
  declare readonly createdAt: CreationOptional<Date>;
  declare readonly updatedAt: CreationOptional<Date>;
}

AdminModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    sequelize,
    paranoid: true,
    tableName: "admins",
  },
);

// Associations
AdminModel.belongsTo(UserModel, {
  targetKey: "id",
  foreignKey: "userId",
});
