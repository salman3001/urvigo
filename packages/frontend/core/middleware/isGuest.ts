export default defineNuxtRouteMiddleware((to, from) => {
  const user = useCookie("user") as unknown as Ref<
    IAdminUser | IUser | IVendorUser
  >;

  if (user.value) {
    if (user.value?.userType === userTypes.ADMIN) {
      return navigateTo(routes.admin.dashboard);
    }
    if (user.value?.userType === userTypes.VENDER) {
      return navigateTo(routes.vendor.dashboard);
    }

    if (user.value?.userType === userTypes.USER) {
      return navigateTo(routes.home);
    }
  }
});
