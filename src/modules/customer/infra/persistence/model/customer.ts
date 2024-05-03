import {
  DataTypes,
  Model,
  Op,
  CreationOptional,
  NonAttribute,
  BelongsToGetAssociationMixin,
  BelongsToSetAssociationMixin,
  BelongsToCreateAssociationMixin,
} from "sequelize";

import {
  UserModel,
  UserCreationAttributes,
} from "~/modules/user/infra/persistence/model/user";
import { ICustomerAttributes } from "~/modules/customer/domain/interface/customer";

import { connection } from "~/shared/infra/db/config/config";

const sequelize = connection.sequelize;

export interface CustomerAttributes extends ICustomerAttributes {}

export interface CustomerCreationAttributes
  extends Omit<CustomerAttributes, "id"> {}

export class CustomerModel
  extends Model<CustomerAttributes, CustomerCreationAttributes>
  implements CustomerAttributes
{
  declare id: CreationOptional<string>;
  declare userId: string;
  declare name?: string | null;
  declare notes?: string | null;

  // Timestamps
  declare readonly createdAt: CreationOptional<Date>;
  declare readonly updatedAt: CreationOptional<Date>;

  // Associations
  declare User?: NonAttribute<UserModel>;

  // Has one User
  declare getUser: BelongsToGetAssociationMixin<UserModel>;
  declare setUser: BelongsToSetAssociationMixin<
    UserCreationAttributes,
    UserModel
  >;
  declare createUser: BelongsToCreateAssociationMixin<UserModel>;
}

CustomerModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    paranoid: true,
    tableName: "customers",
    indexes: [
      {
        unique: true,
        fields: ["userId"],
        where: {
          deletedAt: { [Op.not]: null },
        },
      },
    ],
  },
);

// Associations
CustomerModel.belongsTo(UserModel, {
  targetKey: "id",
  foreignKey: "userId",
});
