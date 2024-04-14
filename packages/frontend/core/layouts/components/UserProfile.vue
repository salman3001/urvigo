<script setup lang="ts">
import avatar from "@images/dummy-avatar.webp";

const auth = authStore();
const getImageUrl = useGetImageUrl();
const { user } = useAuth();

const logout = async () => {
  await auth.logout(userTypes.USER, () => {
    const user = useCookie("user", {
      maxAge: COOKIE_MAX_AGE,
    });

    const token = useCookie("token", {
      maxAge: COOKIE_MAX_AGE,
    });

    const socketToken = useCookie("socketToken", {
      maxAge: COOKIE_MAX_AGE,
    });

    user.value = null;
    token.value = null;
    socketToken.value = null;
    navigateTo(routes.auth.login);
  });
};
</script>

<template>
  <VBadge
    dot
    location="bottom right"
    offset-x="3"
    offset-y="3"
    bordered
    color="success"
  >
    <VAvatar class="cursor-pointer" color="primary" variant="tonal">
      <VImg
        :src="
          getImageUrl(
            user?.profile?.avatar?.breakpoints?.thumbnail?.url,
            avatar,
          )
        "
      />

      <!-- SECTION Menu -->
      <VMenu activator="parent" width="230" location="bottom end" offset="14px">
        <VList>
          <!-- 👉 User Avatar & Name -->
          <VListItem>
            <template #prepend>
              <VListItemAction start>
                <VBadge
                  dot
                  location="bottom right"
                  offset-x="3"
                  offset-y="3"
                  color="success"
                >
                  <VAvatar color="primary" variant="tonal">
                    <VImg
                      :src="
                        getImageUrl(
                          user?.profile?.avatar?.breakpoints?.thumbnail?.url,
                          avatar,
                        )
                      "
                    />
                  </VAvatar>
                </VBadge>
              </VListItemAction>
            </template>

            <VListItemTitle class="font-weight-semibold">
              {{ user?.first_name + " " + user?.last_name }}
            </VListItemTitle>
            <VListItemSubtitle
              ><span class="normalcase">{{
                user?.userType
              }}</span></VListItemSubtitle
            >
          </VListItem>

          <VDivider class="my-2" />

          <!-- 👉 Profile -->
          <VListItem link :to="routes.account.profile">
            <template #prepend>
              <VIcon class="me-2" icon="tabler-user" size="22" />
            </template>

            <VListItemTitle>Profile</VListItemTitle>
          </VListItem>

          <!-- 👉 Settings -->
          <!-- <VListItem link :to="routes.account.settings">
            <template #prepend>
              <VIcon class="me-2" icon="tabler-settings" size="22" />
            </template>

            <VListItemTitle>Settings</VListItemTitle>
          </VListItem> -->

          <!-- 👉 Bookings -->
          <VListItem link :to="routes.bookings.list">
            <template #prepend>
              <VIcon class="me-2" icon="tabler-currency-dollar" size="22" />
            </template>

            <VListItemTitle>Booking</VListItemTitle>
          </VListItem>

          <!-- 👉 Custom Bookings -->
          <VListItem link :to="routes.custom_bookings.list">
            <template #prepend>
              <VIcon class="me-2" icon="tabler-currency-dollar" size="22" />
            </template>

            <VListItemTitle>Custom Booking</VListItemTitle>
          </VListItem>

          <!-- 👉 FAQ -->
          <VListItem link :to="routes.account.wishlist">
            <template #prepend>
              <VIcon class="me-2" icon="tabler-heart" size="22" />
            </template>

            <VListItemTitle>Wishlist</VListItemTitle>
          </VListItem>

          <!-- Divider -->
          <VDivider class="my-2" />

          <!-- 👉 Logout -->
          <VListItem
            @click="
              () => {
                logout();
              }
            "
          >
            <template #prepend>
              <VIcon class="me-2" icon="tabler-logout" size="22" />
            </template>

            <VListItemTitle>Logout</VListItemTitle>
          </VListItem>
        </VList>
      </VMenu>
      <!-- !SECTION -->
    </VAvatar>
  </VBadge>
</template>
