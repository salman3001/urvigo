import type { FetchContext } from "ofetch";
import { toast } from "vuetify-sonner";

export default function useFetchRef(opt?: {
  onSuccess: () => void;
  onError: () => void;
  disableToast: boolean;
}) {
  const fetchRef = ref<typeof $fetch | null>(null);

  const config = useRuntimeConfig();
  const token = useCookie("token");
  const authorization = `Bearer ${toRaw(token.value)}`;
  const loading = ref(false);
  const errors = ref<
    | {
        field: string;
        message: string;
        rule: string;
      }[]
    | null
  >(null);

  const onRequest = () => {
    errors.value = null;
    loading.value = true;
  };

  const onResponse = (ctx: FetchContext<IResType<any>>) => {
    const success = ctx.response?._data?.success;
    const errorsMessages = ctx.response?._data?.errors;

    loading.value = false;

    if (errorsMessages) {
      errors.value = errorsMessages;
    }

    if (success == true) {
      opt?.onSuccess && opt?.onSuccess();
    } else if (success == false) {
      errors.value = ctx.response?._data?.errors || [
        {
          field: "",
          message: ctx.response?._data?.message || "Something went wrong",
          rule: "General Message",
        },
      ];
      opt?.onError && opt?.onError();
    }

    if (opt?.disableToast !== true) {
      const success = ctx.response?._data?.success;
      const message = ctx.response?._data?.message;

      if (message) {
        if (success) {
          toast.success(message);
        } else {
          toast.error(message);
        }
      }
    }
  };

  const onRequestError = (ctx: FetchContext<IResType<any>>) => {
    toast.error(ctx.error?.message || "Request Error");
  };

  const creatFetch = () => {
    if (fetchRef?.value) {
      return fetchRef.value;
    } else {
      fetchRef.value = $fetch.create({
        baseURL: config.public.baseApi,
        headers: {
          authorization,
        },
        onResponse: !process.server ? onResponse : undefined,
        onRequest: !process.server ? onRequest : undefined,
        onRequestError: !process.server ? onRequestError : undefined,
      });

      return fetchRef.value;
    }
  };

  return { fetchRef, loading, fetcher: creatFetch(), errors };
}
