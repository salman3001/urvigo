import { useBaseApi } from "./useBaseApi";

interface InitialQuery {
  page?: number;
  field__is_active?: boolean;
  orderBy?: string;
  search?: string | null;
  perPage: number | null;
}
const createForm = {};
const updateForm = {
  avatar: null,
  logo: null,
  images: [],
  firstName: "",
  lastName: "",
  businessName: "",
  email: "",
  password: "",
  phone: "",
  isActive: "",
  profile: {
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
    instagram: "",
    pintrest: "",
    linkedin: "",
    vk: "",
    whatsapp: "",
    telegram: "",
  },

  faq: [],
  address: [],
};

const updateProfileForm = updateForm;

const createReviewForm = {
  rating: "",
  message: "",
};

class UseVendorApi extends useBaseApi<
  IVendorUser,
  IPageRes<IVendorUser[]>,
  InitialQuery,
  typeof createForm,
  DeepPartial<typeof updateForm>
> {
  constructor() {
    super("/api/vendor-users", createForm);
  }

  updateProfile() {
    const { fetcher, loading, errors } = useFetchRef();
    const form = reactive<DeepPartial<typeof updateForm>>(updateProfileForm);

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

  reviews(query: Partial<InitialQuery>) {
    const { fetcher } = useFetchRef();
    const reviews = async (vendorId: number): Promise<IPageRes<IReview[]>> =>
      fetcher(this.baseUrl + `/${vendorId}/reviews`, {
        query: query,
      });

    return {
      reviews,
      query,
    };
  }

  cretaeReview() {
    const { fetcher, loading, errors } = useFetchRef();
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
        const res = await fetcher<IResType<IReview>>(
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
      errors,
    };
  }
}

export const useVendorApi = new UseVendorApi();
