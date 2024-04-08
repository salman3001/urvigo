export default defineNuxtRouteMiddleware((to, from) => {
  const user = useCookie("user") as unknown as Ref<IUser>;

  if (!user.value) {
    return navigateTo("/auth/login" + `?next=${to.fullPath}`);
  }

  if (user.value?.userType !== userTypes.USER) {
    return abortNavigation();
  }
});
