import { useBaseApi } from "./useBaseApi";

interface InitialQuery {
  page?: number;
  orderBy?: string;
  search?: string | null;
  perPage?: number | null;
}

const createForm = {};

const updateForm: DeepPartial<typeof createForm> = {};

class UseServiceVariantApi extends useBaseApi<
  IServiceVariant,
  IPageRes<IService[]>,
  InitialQuery,
  typeof createForm,
  typeof updateForm
> {
  constructor() {
    super("/api/service-variants", createForm);
  }
}

export const useServiceVariantApi = new UseServiceVariantApi();
