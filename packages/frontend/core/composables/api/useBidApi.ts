import { useBaseApi } from "./useBaseApi";

interface InitialQuery {
  page?: number;
  field__is_active?: boolean;
  orderBy?: string;
  search?: string | null;
  perPage?: number | null;
  where_expires_at_lt?: string | null;
  where_active?: null | number;
  where_acepted?: null | number;
}

const createForm = {
  serviceRequirementId: "",
  offeredPrice: "",
  message: "",
};
const updateForm = {};

const acceptNegotiateForm = {
  newPrice: "" as number | string,
};

class UseBidApi extends useBaseApi<
  IBid,
  IPageRes<IBid[]>,
  InitialQuery,
  typeof createForm,
  typeof updateForm
> {
  constructor() {
    super("/api/bids", createForm, updateForm);
  }

  acceptNegotiate(initialForm: typeof acceptNegotiateForm) {
    const { fetcher, loading, errors } = useFetchRef();
    const form = reactive(initialForm);

    const acceptNegotiate = async (
      id: number,
      cd?: {
        onSuccess?: () => void;
        onError?: () => void;
      },
    ) => {
      loading.value = true;
      const formData = convertToFormData(form);
      try {
        const res = await fetcher<IResType<any>>(
          this.baseUrl + `/${id}/accept-negotiate`,
          {
            method: "put",
            body: formData,
          },
        );

        if (res.success == true) {
          cd?.onSuccess && cd?.onSuccess();
        }
      } catch (error) {
        console.log(error);
        cd?.onError && cd?.onError();
      }

      loading.value = false;
    };

    return {
      acceptNegotiate,
      form,
      loading,
      errors,
    };
  }
}

export const useBidApi = new UseBidApi();
