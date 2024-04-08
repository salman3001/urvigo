export default defineNuxtRouteMiddleware((to, from) => {
  const user = useCookie("user") as unknown as Ref<IVendorUser>;

  if (!user.value) {
    return navigateTo("/auth/vendor/login" + `?next=${to.fullPath}`);
  }

  if (user.value?.userType !== userTypes.VENDER) {
    return abortNavigation();
  }
});
