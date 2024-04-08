export default function useGetImageUrl() {
  const config = useRuntimeConfig();
  const getImageUrl = (url: string | undefined, defualtUrl?: string) => {
    if (url) {
      return config.public.baseApi + url;
    } else {
      return defualtUrl || "/images/No-image-found.jpg";
    }
  };

  return getImageUrl;
}
