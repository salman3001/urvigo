import { useBaseApi } from "./useBaseApi";

interface InitialQuery {
  page?: number;
  orderBy?: string;
  search?: string | null;
  perPage: number | null;
}
const createForm = {};

const updateForm = {
  serviceVariantIds: [],
};

const addItemFrom = {
  serviceId: "",
};

class UseWishlistApi extends useBaseApi<
  IWishlist,
  IResType<IWishlist[]>,
  InitialQuery,
  typeof createForm,
  typeof updateForm
> {
  constructor() {
    super("/api/my-wishlist", createForm);
  }

  detailList() {
    const { fetcher, loading } = useFetchRef();
    const detailList = async (): Promise<IResType<IService[]>> =>
      fetcher(`${this.baseUrl}/detailed`);
    return { detailList };
  }

  addItem(initialForm: typeof addItemFrom) {
    const { fetcher, loading, errors } = useFetchRef();
    const form = reactive(initialForm);

    const addItem = async (cd?: {
      onSuccess?: () => void;
      onError?: () => void;
    }) => {
      loading.value = true;
      const formData = convertToFormData(form);
      try {
        const res = await fetcher<IResType<IWishlist>>(
          this.baseUrl + `/add-item`,
          {
            method: "post",
            body: formData,
          },
        );

        if (res.success == true) {
          cd?.onSuccess && cd?.onSuccess();
        }

        return res;
      } catch (error) {
        console.log(error);
        cd?.onError && cd?.onError();
      }

      loading.value = false;
    };

    return {
      addItem,
      form,
      loading,
      errors,
    };
  }

  deletItem() {
    const { fetcher, loading, errors } = useFetchRef();

    const deletItem = async (
      itemId: number,
      cd?: {
        onSuccess?: () => void;
        onError?: () => void;
      },
    ) => {
      loading.value = true;
      try {
        const res = await fetcher<IResType<IWishlist>>(
          this.baseUrl + `/${itemId}`,
          {
            method: "delete",
          },
        );

        if (res.success == true) {
          cd?.onSuccess && cd?.onSuccess();
        }

        return res;
      } catch (error) {
        console.log(error);
        cd?.onError && cd?.onError();
      }

      loading.value = false;
    };

    return {
      deletItem,
      loading,
      errors,
    };
  }
}

export const useWishlistApi = new UseWishlistApi();
