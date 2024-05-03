import { DataTypes, Model, Op, CreationOptional } from "sequelize";

import { connection } from "~/shared/infra/db/config/config";
import { IUserAttributes } from "~/modules/user/domain/interface/user";

const sequelize = connection.sequelize;

export interface UserAttributes extends IUserAttributes {}

export interface UserCreationAttributes extends Omit<UserAttributes, "id"> {}

export interface UserUpdateAttributes
  extends Omit<UserCreationAttributes, "credentialUuid"> {}

export class UserModel
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  declare id: CreationOptional<string>;
  declare password: string;
  declare email: string;
  declare phone?: string | null;

  // Timestamps
  declare readonly createdAt: CreationOptional<Date>;
  declare readonly updatedAt: CreationOptional<Date>;
}

UserModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "users",
    paranoid: true,
    indexes: [
      {
        unique: true,
        fields: ["email"],
        where: {
          deletedAt: { [Op.not]: null },
        },
      },
      {
        unique: true,
        fields: ["phone"],
        where: {
          deletedAt: { [Op.not]: null },
        },
      },
    ],
  },
);
