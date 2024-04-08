import type { FetchContext } from "ofetch";
import { toast } from "vuetify-sonner";

export default function (
  opt: {
    disableToast?: boolean;
  } = { disableToast: false },
): typeof $fetch {
  const config = useRuntimeConfig();

  const token = useCookie("token");

  const authorization = `Bearer ${toRaw(token.value)}`;

  const onResponse = (ctx: any) => {
    if (opt.disableToast !== true) {
      const success = ctx.response._data?.success;
      const message = ctx.response._data?.message;

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

  // const onRequest = (c: FetchContext<any, any>): void => {
  //   const queryString = qs.stringify(c.options.query);
  //   let newUrl: RequestInfo = "";
  //   if (queryString) {
  //     newUrl = c.request + "?" + queryString;
  //   } else {
  //     newUrl = c.request;
  //   }
  //   c.options.query = {};
  //   c.request = newUrl;
  // };

  return $fetch.create({
    baseURL: config.public.baseApi,
    headers: {
      authorization,
    },
    onResponse: !process.server ? onResponse : undefined,
    onRequestError: !process.server ? onRequestError : undefined,
  });
}
