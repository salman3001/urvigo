import type { FetchContext } from "ofetch";
import { toast } from "vuetify-sonner";

export default function (opt?: {
  disableToast?: boolean;
  onSuccess?: () => void;
  onError?: () => void;
}) {
  const config = useRuntimeConfig();
  const token = useCookie("token");
  const authorization = `Bearer ${toRaw(token.value)}`;
  const loading = ref(false);

  const onRequest = () => {
    loading.value = true;
  };

  const onResponse = (ctx: FetchContext<IResType<any>>) => {
    const success = ctx.response?._data?.success;

    loading.value = false;

    if (success == true) {
      opt?.onSuccess && opt?.onSuccess();
    } else if (success == false) {
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

  return {
    fetch: $fetch.create({
      baseURL: config.public.baseApi,
      headers: {
        authorization,
      },
      onResponse: !process.server ? onResponse : undefined,
      onRequest: !process.server ? onRequest : undefined,
      onRequestError: !process.server ? onRequestError : undefined,
    }),
    loading: loading,
  };
}
