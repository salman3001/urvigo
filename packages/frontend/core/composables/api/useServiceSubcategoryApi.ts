import { useBaseApi } from "./useBaseApi";

interface InitialQuery {
  page?: number;
  orderBy?: string;
  search?: string | null;
  perPage?: number | null;
}

const createForm = {};

const updateForm = {};

class UseServiceSubcategoryApi extends useBaseApi<
  IServiceSubcategory,
  IResType<IServiceSubcategory[]>,
  InitialQuery,
  typeof createForm,
  typeof updateForm
> {
  constructor() {
    super("/api/service-subcategory", createForm, updateForm);
  }
}

export const useServiceSubategoyrApi = new UseServiceSubcategoryApi();
