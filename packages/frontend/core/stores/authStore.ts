import { defineStore } from "pinia";
import { ref } from "vue";
import { userTypes } from "@/utils/enums";

const authStore = defineStore("Auth", () => {
  const { fetcher, fetchRef } = useFetchRef();
  const login = async (
    email: string,
    password: string,
    userType: userTypes,
  ) => {
    try {
      const res = await fetcher<IResType<any>>("/api/auth/login", {
        method: "post",
        body: { email, password, userType },
      });

      if (res.success) {
        fetchRef.value = null;
      }
      return res;
    } catch (error: any) {
      return null;
    }
  };

  const signup = async (form: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
    passwordConfirmation: string;
    bussinessName?: string;
    userType: userTypes;
  }) => {
    try {
      const res = await fetcher<IResType<any>>("/api/auth/signup", {
        method: "post",
        body: form,
      });
      if (res.success) {
        fetchRef.value = null;
      }
      return res;
    } catch (error: any) {
      return null;
    }
  };

  const logout = async (userType: userTypes, onSuccess?: () => void) => {
    try {
      await fetcher("/api/auth/logout", {
        method: "post",
        body: { userType },
      });
      fetchRef.value = null;
      onSuccess && onSuccess();
    } catch (error: any) {}
  };

  const getOtp = (cb?: { onSuccess?: () => void; onError?: () => void }) => {
    const loading = ref(false);
    const execute = async (data: { email: string; userType: userTypes }) => {
      try {
        loading.value = true;
        const res = await fetcher("/api/auth/get-otp", {
          method: "post",
          body: data,
        });
        loading.value = false;
        cb?.onSuccess && cb?.onSuccess();
      } catch (error: any) {
        loading.value = false;
        cb?.onError && cb?.onError();
      }
    };
    return { execute, loading };
  };

  const verifyOtpAndUpdatePWD = (cb?: {
    onSuccess?: () => void;
    onError?: () => void;
  }) => {
    const loading = ref(false);
    const execute = async (data: any) => {
      try {
        loading.value = true;
        const res = await fetcher("/api/auth/verify-otp-update-password", {
          method: "post",
          body: data,
        });
        loading.value = false;
        cb?.onSuccess && cb?.onSuccess();
      } catch (error: any) {
        loading.value = false;
        cb?.onError && cb?.onError();
      }
    };
    return { execute, loading };
  };

  return {
    login,
    signup,
    getOtp,
    verifyOtpAndUpdatePWD,
    logout,
  };
});

export default authStore;
