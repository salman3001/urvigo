interface baseQuery {
  page?: number | null;
  orderBy?: string | null;
  search?: string | null;
  perPage?: number | null;
}

export class useBaseApi<
  Model,
  listRsp,
  initialQuery extends baseQuery,
  createForm extends object,
  updateform extends object,
> {
  constructor(
    public baseUrl: string,
    public creatForm: createForm,
    public updateForm: updateform,
  ) {}

  list(initialQuery: initialQuery) {
    const { fetcher } = useFetchRef();

    const query = reactive<initialQuery>(initialQuery);

    const list = async (): Promise<listRsp> =>
      fetcher(this.baseUrl, {
        query: query,
      });

    return {
      query,
      list,
    };
  }

  show() {
    const { fetcher } = useFetchRef();
    const show = async (id: number): Promise<IResType<Model>> =>
      fetcher(`${this.baseUrl}/${id}`);
    return { show };
  }

  cretae() {
    const { fetcher, loading } = useFetchRef();
    const form = reactive(this.creatForm);

    const create = async (cd?: {
      onSuccess?: () => void;
      onError?: () => void;
    }) => {
      loading.value = true;
      const formData = convertToFormData(form);
      try {
        const res = await fetcher<IResType<Model>>(this.baseUrl, {
          method: "post",
          body: formData,
        });

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
      create,
      form,
      loading,
    };
  }

  update(initialForm: updateform) {
    const { fetcher, loading } = useFetchRef();
    const form = reactive(initialForm);

    const update = async (
      id: number,
      cd?: {
        onSuccess?: () => void;
        onError?: () => void;
      },
    ) => {
      loading.value = true;
      const formData = convertToFormData(form);
      try {
        const res = await fetcher<IResType<Model>>(this.baseUrl + `/${id}`, {
          method: "put",
          body: formData,
        });

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
      update,
      form,
      loading,
    };
  }

  destroy() {
    const { fetcher, loading } = useFetchRef();

    const destroy = async (
      id: number,
      cd?: {
        onSuccess?: () => void;
        onError?: () => void;
      },
    ) => {
      loading.value = true;
      try {
        const res = await fetcher<IResType<Model>>(this.baseUrl + `/${id}`, {
          method: "delete",
        });

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
      destroy,
      loading,
    };
  }
}
