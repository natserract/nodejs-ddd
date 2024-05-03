import {
  Model,
  type ModelStatic,
  Attributes,
  type WhereOptions,
  OrderItem,
} from "sequelize";

import { NotFoundError } from "~/shared/infra/error";
import {
  EagerLoad,
  IBaseFields,
  GetOptions,
  GetOptionsBaseFields,
} from "~/shared/infra/persistence/repository/types";

export abstract class BaseReadRepository<ModelT extends Model> {
  protected readonly model: ModelStatic<ModelT>;
  eagerLoadMapping: Map<string, EagerLoad>;
  orderSet: Set<OrderItem>;
  baseWhereClause: WhereOptions<Attributes<ModelT> & IBaseFields>;

  constructor(
    model: ModelStatic<ModelT>,
    eagerLoad: EagerLoad[] = [],
    order: OrderItem[] = [],
    whereClause: WhereOptions<Attributes<ModelT> & IBaseFields> = {}
  ) {
    this.model = model;
    this.eagerLoadMapping = new Map(eagerLoad.map((el) => [el.as, el]));
    this.orderSet = new Set(order);
    this.baseWhereClause = whereClause;
  }

  async get(
    id: number,
    options: GetOptions<ModelT, "parentTransaction" | "paranoid"> = {
      paranoid: true,
    }
  ): Promise<ModelT> {
    const readModel = await this.getAny(id, options);
    if (!readModel) {
      throw new NotFoundError(`Could not find ${this.model.name} ${id}`);
    }

    return readModel;
  }

  async getAny(
    id: number,
    options: GetOptions<ModelT, "parentTransaction" | "paranoid"> = {
      paranoid: true,
    }
  ): Promise<ModelT | null> {
    const readModel = await this.model.findByPk(id, {
      include: [...this.eagerLoadMapping.values()],
      transaction: options.parentTransaction,
      paranoid: options.paranoid,
    });

    return readModel;
  }

  async getAll(
    options: GetOptionsBaseFields<
      ModelT,
      "limit" | "offset" | "parentTransaction"
    > = {
      limit: undefined,
      offset: 0,
    }
  ): Promise<ModelT[]> {
    try {
      return await this.model.findAll({
        limit: options.limit,
        offset: options.offset,
        transaction: options.parentTransaction,
        order: this.orderSet.size
          ? [...this.orderSet]
          : [["createdAt", "DESC"]],
        include: [...this.eagerLoadMapping.values()],
      });
    } catch (err) {
      throw err;
    }
  }

  async first(
    whereClause: WhereOptions<Attributes<ModelT> & IBaseFields> = {},
    options: GetOptionsBaseFields<
      ModelT,
      "limit" | "offset" | "parentTransaction" | "paranoid"
    > = {
      paranoid: true,
    }
  ): Promise<ModelT | null> {
    const readModel = await this.firstAny(whereClause, options);

    if (!readModel) {
      throw new NotFoundError(
        `Could not find ${this.model.name} ${JSON.stringify(whereClause)}`
      );
    }

    return readModel;
  }

  async firstAny(
    whereClause: WhereOptions<Attributes<ModelT> & IBaseFields> = {},
    options: GetOptionsBaseFields<
      ModelT,
      "limit" | "offset" | "parentTransaction" | "paranoid"
    > = {
      paranoid: true,
    }
  ): Promise<ModelT | null> {
    const readModel = await this.model.findOne({
      where: {
        ...this.baseWhereClause,
        ...whereClause,
      },
      include: [...this.eagerLoadMapping.values()],
      order: [...this.orderSet],
      transaction: options.parentTransaction,
      paranoid: options.paranoid,
    });

    return readModel;
  }

  async where(
    whereClause: WhereOptions<Attributes<ModelT> & IBaseFields> = {},
    options: GetOptionsBaseFields<
      ModelT,
      "attributes" | "limit" | "offset" | "parentTransaction"
    > = {
      limit: undefined,
      offset: 0,
    }
  ): Promise<ModelT[]> {
    try {
      return await this.model.findAll({
        attributes: options.attributes,
        where: { ...this.baseWhereClause, ...whereClause },
        limit: options.limit,
        offset: options.offset,
        order: this.orderSet.size
          ? [...this.orderSet]
          : [["createdAt", "DESC"]],
        include: [...this.eagerLoadMapping.values()],
        transaction: options.parentTransaction,
      });
    } catch (err) {
      throw err;
    }
  }

  async count(
    whereClause: WhereOptions<Attributes<ModelT> & IBaseFields> = {},
    options: GetOptionsBaseFields<ModelT, "parentTransaction">
  ): Promise<number> {
    const countModel = await this.model.count({
      distinct: true,
      col: "id",
      where: { ...this.baseWhereClause, ...whereClause },
      transaction: options.parentTransaction,
    });

    return countModel;
  }
}
