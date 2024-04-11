import { useBaseApi } from "./useBaseApi";

interface InitialQuery {
  page?: number;
  field__is_active?: boolean;
  orderBy?: string;
  search?: string | null;
  perPage: number | null;
}
const createForm = {};
const updateForm = {};
const updateProfileForm = {
  avatar: null,
  logo: null,
  images: {
    shortDesc: "",
    longDesc: "",
    isActive: "",
  },
  seo: {
    metaTitle: "",
    metaKeywords: "",
    metaDesc: "",
  },
  social: {
    website: "",
    facebook: "",
    twitter: "",
    instagram: "",
    pintrest: "",
    linkedin: "",
    vk: "",
    whatsapp: "",
    telegram: "",
  },

  faq: [
    {
      quest: "",
      ans: "",
    },
  ],
  address: [
    {
      address: "",
      geoLocation: "",
    },
  ],
};
const createReviewForm = {
  rating: "",
  message: "",
};

class UseVendorApi extends useBaseApi<
  IVendorUser,
  IPageRes<IVendorUser[]>,
  InitialQuery,
  typeof createForm,
  typeof updateForm
> {
  constructor() {
    super("/api/vendor-users", createForm, updateForm);
  }

  updateProfile() {
    const { fetcher, loading, errors } = useFetchRef();
    const form = reactive(updateProfileForm);

    const update = async (
      id: number,
      cd?: {
        onSuccess?: () => void;
        onError?: () => void;
      },
    ) => {
      loading.value = true;
      try {
        const res = await fetcher<IResType<IVendorUser>>(
          this.baseUrl + `/${id}`,
          {
            method: "put",
            body: form,
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
      update,
      form,
      loading,
      errors,
    };
  }

  reviews(vendorId: number) {
    const { fetcher } = useFetchRef();
    const reviews = async (): Promise<IPageRes<IReview[]>> =>
      fetcher(this.baseUrl + `/${vendorId}/reviews`);

    return {
      reviews,
    };
  }

  cretaeReview() {
    const { fetch, loading, error } = usePostFetch();
    const form = reactive(createReviewForm);

    const cretaeReview = async (
      vendorId: number,
      cd?: {
        onSuccess?: () => void;
        onError?: () => void;
      },
    ) => {
      loading.value = true;
      try {
        const res = await fetch<IResType<IReview>>(
          this.baseUrl + `/${vendorId}/reviews`,
          {
            method: "post",
            body: form,
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
      cretaeReview,
      form,
      loading,
      error,
    };
  }
}

export const useVendorApi = new UseVendorApi();
