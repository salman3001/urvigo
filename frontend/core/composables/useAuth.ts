import { permissions } from "@/utils/enums";

export default function useAuth() {
  const user = useCookie("user") as Ref<IUser | IVendorUser | IAdminUser>;
  const token = useCookie("token");
  const socketToken = useCookie("socketToken");

  const hasRole = (name: string) => {

    if (user && user.value.userType == 'admin') {
      return user.value?.role?.name === name;
    } else {
      return false;
    }
  };

  const hasPermission = (name: permissions) => {
    if (user && user.value.userType == 'admin' && user.value?.role?.name === "Super Admin") {
      return true;
    }

    if (user && user.value.userType == 'admin' && user.value?.role?.is_active == 0) {
      return false;
    }

    if (user && user.value.userType == 'admin' && (user.value?.role?.permissions as string[])?.includes(name)) {
      return true;
    } else {
      return false;
    }
  };
  return {
    user,
    token,
    socketToken,
    hasPermission,
    hasRole,
  };
}
