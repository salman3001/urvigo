import { useBaseApi } from "./useBaseApi";

interface InitialQuery {
  page?: number;
  field__is_active?: boolean | null;
  orderBy?: string;
  field__service_category_id?: number | null;
  field__service_subcategory_id?: number | null;
  search?: string | null;
  perPage?: number | null;
  field__vendor_user_id?: number | null;
}

const createForm = {
  thumbnail: null,
  images: [] as File[],
  video: null,
  variantImages: [] as File[],
  service: {
    name: "",
    slug: "",
    serviceCategoryId: "",
    serviceSubcategoryId: "",
    locationSpecific: "",
    shortDesc: "",
    longDesc: "",
    geoLocation: "23.5,67.3",
    isActive: true,
  },
  tags: [] as number[],
  seo: {
    metaTitle: "",
    metaKeywords: "",
    metaDesc: "",
  },
  faq: [] as {
    quest: string;
    ans: string;
  }[],
  variant: [
    {
      name: "",
      price: 0,
      discountType: "flat",
      discountFlat: 0,
      discountPercentage: 0,
      desc: "",
    },
  ],
};

const createReviewForm = {
  rating: "",
  message: "",
};

const updateForm: DeepPartial<typeof createForm> = {};

class UseServiceApi extends useBaseApi<
  IService,
  IPageRes<IService[]>,
  InitialQuery,
  typeof createForm,
  typeof updateForm
> {
  constructor() {
    super("/api/service", createForm, updateForm);
  }

  myList(initialQuery: InitialQuery) {
    const { fetcher } = useFetchRef();

    const query = reactive<InitialQuery>(initialQuery);

    const list = async (): Promise<IPageRes<IService[]>> =>
      fetcher(this.baseUrl + "/my-list", {
        query: query,
      });

    return {
      query,
      list,
    };
  }

  showBySlug() {
    const { fetcher, loading } = useFetchRef();
    const show = async (slug: string): Promise<IResType<IService>> =>
      fetcher(`${this.baseUrl}/by-slug/${slug}`);
    return { show };
  }

  cretae_review() {
    const { fetcher, loading, errors } = useFetchRef();
    const form = reactive(createReviewForm);

    const cretae_review = async (
      serviceId: number,
      cd?: {
        onSuccess?: () => void;
        onError?: () => void;
      },
    ) => {
      loading.value = true;
      const formData = convertToFormData(form);
      try {
        const res = await fetcher<IResType<IReview>>(
          this.baseUrl + `/${serviceId}/reviews`,
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
        cd?.onError && cd?.onError();
      }

      loading.value = false;
    };

    return {
      cretae_review,
      form,
      loading,
      errors,
    };
  }
}

export const useServiceApi = new UseServiceApi();
