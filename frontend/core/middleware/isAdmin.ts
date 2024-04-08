export default defineNuxtRouteMiddleware((to, from) => {
  const user = useCookie("user") as unknown as Ref<IAdminUser>;

  if (!user.value) {
    return navigateTo("/auth/admin/login" + `?next=${to.fullPath}`);
  }

  if (user.value?.userType !== userTypes.ADMIN) {
    return abortNavigation();
  }
});
