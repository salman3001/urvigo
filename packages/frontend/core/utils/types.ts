interface TableRequestProps {
  pagination: {
    sortBy: string;
    descending: boolean;
    page: number;
    rowsPerPage: number;
  };
  filter?: any;
  getCellValue: (col: any, row: any) => any;
}

type preload = Record<
  string,
  {
    select?: select;
    where?: where;
    preload?: preload[];
    withAggregate?: withAggregate[];
    withCount?: withCount[];
    limit?: number;
    sortBy?: string;
    descending?: "true" | "false" | null;
  }
>;
type whereLike = Record<string, string> | null;
type whereILike = Record<string, string> | null;
type opt = ">" | ">=" | ">" | ">=" | "=";
type where = Record<string, [opt, string]>;
type select = string[] | null;
type join = string[];
type withAggregate = {
  relation: string;
  aggregator: string;
  field: string;
  as: string;
};
type withCount = {
  relation: string;
  as: string;
};

interface AdditionalParams {
  page?: number | null;
  rowsPerPage?: number | null;
  sortBy?: string | null;
  descending?: "true" | "false" | null;
  select?: select;
  whereLike?: whereLike | null;
  whereILike?: whereILike | null;
  where?: where;
  whereNull?: string | null;
  whereNotNull?: string | null;
  preload?: preload[] | null;
  withAggregate?: withAggregate[];
  withCount?: withCount[];
  join?: join[];
}

type IQs = {
  search?: string,
  orderBY?: string,
  page?: number,
  perPage?: number,

} & Record<any, any>


type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>;
};
