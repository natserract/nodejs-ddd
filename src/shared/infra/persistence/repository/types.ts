import {
  Model,
  type ModelStatic,
  FindOptions,
  Attributes,
  IncludeOptions,
  type WhereOptions,
  OrderItem,
  Transaction as SequelizeTransaction,
} from "sequelize";

export type EagerLoad = Omit<IncludeOptions, "include"> & {
  as: string;
  model: ModelStatic<any>;
  include?: EagerLoadNested1[];
};

export type EagerLoadNested1 = Omit<IncludeOptions, "include"> & {
  as: string;
  model: ModelStatic<any>;
  include?: EagerLoadNested2[];
};
export type EagerLoadNested2 = Omit<IncludeOptions, "include"> & {
  as: string;
  model: ModelStatic<any>;
  include?: EagerLoadNested3WithException[];
};
export type EagerLoadNested3WithException = Omit<IncludeOptions, "include"> & {
  as: string;
  model: ModelStatic<any>;
  include?: EagerLoadNested3WithException[];
  exception: string;
};

export interface PaginationParams {
  limit?: number;
  offset?: number;
}

export interface IBaseFields {
  createdAt: Date;
  updatedAt: Date;
}

export type FindOptionsTransaction<ModelT extends Model> = Omit<
  FindOptions<Attributes<ModelT>>,
  "transaction"
> & {
  // Override transaction prop
  parentTransaction?: SequelizeTransaction;
};

export type GetOptions<
  ModelT extends Model,
  K extends keyof FindOptionsTransaction<Attributes<ModelT>>,
> = Pick<FindOptionsTransaction<Attributes<ModelT>>, K>;

export type GetOptionsBaseFields<
  ModelT extends Model,
  K extends keyof FindOptionsTransaction<Attributes<ModelT>>,
> = Pick<FindOptionsTransaction<Attributes<ModelT> & IBaseFields>, K>;

export abstract class Repository {
  abstract init<ModelT extends Model>(
    model: ModelStatic<ModelT>,
    eagerLoad?: EagerLoad[],
    order?: OrderItem[],
    whereClause?: WhereOptions<Attributes<ModelT> & IBaseFields>
  ): void;
}
