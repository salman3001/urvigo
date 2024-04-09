import noImgage from "@images/no-image.png";

export default function useGetImageUrl() {
  const config = useRuntimeConfig();
  const getImageUrl = (url: string | undefined, defualtUrl?: string) => {
    if (url) {
      return config.public.baseApi + url;
    } else {
      return defualtUrl || noImgage;
    }
  };

  return getImageUrl;
}
