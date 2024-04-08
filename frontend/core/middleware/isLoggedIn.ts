export default defineNuxtRouteMiddleware((to, from) => {
  const user = useCookie("user");

  if (!user.value) {
    return navigateTo("/auth/login" + `?next=${to.fullPath}`);
  }
});
