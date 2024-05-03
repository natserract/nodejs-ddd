import {
  Model,
  type ModelStatic,
  Transaction as TransactionSequelize,
} from "sequelize";
import { Aggregate, EntityProps } from "types-ddd";

import { connection } from "~/shared/infra/db/config/config";
import {
  AggregateNotFound,
  NotFoundError,
  StateError,
} from "~/shared/infra/error";

const sequelize = connection.sequelize;

// @todo: fix Aggregate |  Entity;
type PolymorphicAggregate = object;

export abstract class BaseWriteRepository<
  WriteModelType extends Model,
  WriteAttributesType extends EntityProps,
  AggregateRootType extends PolymorphicAggregate = PolymorphicAggregate,
> {
  protected readonly model: ModelStatic<WriteModelType>;

  constructor(model: ModelStatic<WriteModelType>) {
    this.model = model;
  }

  async getById(
    id: Aggregate<WriteAttributesType>["id"],
  ): Promise<WriteModelType> {
    const writeModel = await this.model.findOne({
      where: {
        // tslint:disable-next-line:no-any Can't wrangle correct type
        id: id as any,
      },
    });

    if (!writeModel) {
      throw new AggregateNotFound(this.model.name, id);
    }

    return writeModel;
  }

  async save(
    aggregateRoot: AggregateRootType,
    parentTransaction?: TransactionSequelize,
  ): Promise<WriteModelType> {
    const values = this.toValues(aggregateRoot);

    return this.model.create(values, {
      transaction: parentTransaction,
    });
  }

  async update(
    aggregateRoot: AggregateRootType,
    parentTransaction?: TransactionSequelize,
  ): Promise<WriteModelType> {
    try {
      return await this.updateAny(aggregateRoot, parentTransaction);
    } catch (err) {
      throw err;
    }
  }

  async updateAny(
    aggregateRoot: AggregateRootType,
    parentTransaction?: TransactionSequelize,
  ): Promise<WriteModelType> {
    if ("modifiable" in aggregateRoot && !(aggregateRoot as any).modifiable) {
      throw new StateError("Object is on an unmodifiable status");
    }

    const values = this.toValues(aggregateRoot);
    try {
      const writeModel = await this.getById(values.id);
      writeModel.set(values);

      const updatedModel = writeModel.save({
        fields: Object.keys(values),
        transaction: parentTransaction,
      });
      return updatedModel;
    } catch (err) {
      throw err;
    }
  }

  async delete(
    id: Aggregate<WriteAttributesType>["id"],
    parentTransaction?: TransactionSequelize,
  ): Promise<number> {
    const writeModel = this.deleteAny(id, parentTransaction);
    if (!writeModel) {
      throw new NotFoundError("Failed to delete " + this.model.name);
    }
    return writeModel;
  }

  async deleteAny(
    id: Aggregate<WriteAttributesType>["id"],
    parentTransaction?: TransactionSequelize,
  ): Promise<number> {
    try {
      const writeModel = this.model.destroy({
        // tslint:disable-next-line:no-any Can't wrangle correct type
        where: { id: id as any },
        transaction: parentTransaction,
      });
      return writeModel;
    } catch (err) {
      throw err;
    }
  }

  static async beginTransaction<T>(
    options: { t?: TransactionSequelize },
    callback: (t: TransactionSequelize) => Promise<T>,
  ) {
    let currentTransaction: TransactionSequelize | undefined = options.t;
    if (!currentTransaction) {
      currentTransaction = await sequelize.transaction();
    }

    try {
      const result: T = await callback(currentTransaction);
      // commit the transaction only when it does not have a parent transaction
      if (!options.t) {
        await currentTransaction.commit();
      }
      return result;
    } catch (err) {
      if (!options.t) {
        await currentTransaction.rollback();
      }
      throw err;
    }
  }

  protected toAggregateRoot(model: WriteModelType): AggregateRootType {
    return Object.assign(model);
  }

  protected toValues(aggregateRoot: AggregateRootType) {
    const _aggregateRoot = aggregateRoot as Aggregate<WriteAttributesType>;
    return Object.assign(_aggregateRoot.toObject());
  }
}
