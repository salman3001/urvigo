import { useBaseApi } from "./useBaseApi";

interface InitialQuery {
  page?: number;
  field__is_active?: boolean;
  orderBy?: string;
  search?: string | null;
  perPage: number | null;
}
const createForm = {};
interface updateForm {
  image?: File;
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  phone?: string;
  isActive?: boolean;
  isPublic?: boolean;
  address?: { address: string; geoLocation: string }[];
  social?: Partial<{
    website: string;
    facebook: string;
    twitter: string;
    instagram: string;
    pintrest: string;
    linkedin: string;
    vk: string;
    whatsapp: string;
    telegram: string;
  }>;
  languages?: number[];
  skills?: { name: string; desc: string }[];
  NotificationSettings?: Partial<{
    onMessageRecieve: boolean;
    onCommentReply: boolean;
    onServiceUpdate: boolean;
    onOffers: boolean;
  }>;
}

const createReviewForm = {
  rating: "",
  message: "",
};

class UseUserApi extends useBaseApi<
  IVendorUser,
  IPageRes<IVendorUser[]>,
  InitialQuery,
  typeof createForm,
  updateForm
> {
  constructor() {
    super("/api/users", createForm);
  }

  updateProfile(initialForm: updateForm) {
    const { fetcher, loading, errors } = useFetchRef();
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
        const res = await fetcher<IResType<IVendorUser>>(
          this.baseUrl + `/${id}/update-profile`,
          {
            method: "put",
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
      update,
      form,
      loading,
      errors,
    };
  }
}

export const useUserApi = new UseUserApi();
