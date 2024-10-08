<script setup lang="ts">
import type { RouteLocationRaw } from "vue-router/auto";
import { useDisplay } from "vuetify";

import { useWindowScroll } from "@vueuse/core";
import navImg from "@images/front-pages/misc/nav-item-col-img.png";

import NavbarThemeSwitcher from "@/layouts/components/NavbarThemeSwitcher.vue";
import { VNodeRenderer } from "@layouts/components/VNodeRenderer";
import { themeConfig } from "@themeConfig";
import UserProfile from "@/layouts/components/UserProfile.vue";
import NavBarNotifications from "@/layouts/components/NavBarNotifications.vue";
import NavSearchBar from "@/layouts/components/NavSearchBar.vue";

const display = useDisplay();
const { user } = useAuth();

interface navItem {
  name: string;
  to: RouteLocationRaw;
}

interface MenuItem {
  listTitle: string;
  listIcon: string;
  navItems: navItem[];
}

const navMenuItems = [
  { label: "Home", link: routes.home },
  { label: "Services", link: routes.services.list },
  { label: "Service Requirements", link: routes.service_requirement.list },
];

const { y } = useWindowScroll();

const route = useRoute();
const router = useRouter();
const sidebar = ref(false);

watch(
  () => display,
  () => {
    return display.mdAndUp ? (sidebar.value = false) : sidebar.value;
  },
  { deep: true },
);

const isMenuOpen = ref(false);
const isMegaMenuOpen = ref(false);

const menuItems: MenuItem[] = [
  {
    listTitle: "Service Requirement",
    listIcon: "tabler-layout-grid",
    navItems: [
      { name: "My Requirement", to: { path: routes.service_requirement.list } },
      {
        name: "Post Requirement",
        to: { path: routes.service_requirement.list },
      },
      // { name: 'Payment', to: { name: 'front-pages-payment' } },
      // { name: 'Checkout', to: { name: 'front-pages-checkout' } },
      // { name: 'Help Center', to: { name: 'front-pages-help-center' } },
    ],
  },
  {
    listTitle: "Bookings",
    listIcon: "tabler-lock-open",
    navItems: [
      { name: "My Bookings", to: { path: routes.bookings.list } },
      { name: "My Custom Bookings", to: { path: routes.custom_bookings.list } },
      // { name: 'Login (Cover)', to: { name: 'pages-authentication-login-v2' } },
      // { name: 'Register (Basic)', to: { name: 'pages-authentication-register-v1' } },
      // { name: 'Register (Cover)', to: { name: 'pages-authentication-register-v2' } },
      // { name: 'Register (Multi-steps)', to: { name: 'pages-authentication-register-multi-steps' } },
      // { name: 'Forgot Password (Basic)', to: { name: 'pages-authentication-forgot-password-v1' } },
      // { name: 'Forgot Password (Cover)', to: { name: 'pages-authentication-forgot-password-v2' } },
      // { name: 'Reset Password (Basic)', to: { name: 'pages-authentication-reset-password-v1' } },
      // { name: 'Reset Password (cover  )', to: { name: 'pages-authentication-reset-password-v2' } },
    ],
  },
  {
    listTitle: "Other",
    listIcon: "tabler-photo",
    navItems: [
      { name: "Pricing", to: { path: routes.pricing } },
      { name: "Help Center", to: { path: routes.help_center.list } },
      { name: "FAQ", to: { path: routes.faqs } },
      { name: "Blogs", to: { path: routes.blogs.list } },
      { name: "Contact", to: { path: routes.contact } },
      { name: "About", to: { path: routes.about } },
      // { name: 'Verify Email (Basic)', to: { name: 'pages-authentication-verify-email-v1' } },
      // { name: 'Verify Email (Cover)', to: { name: 'pages-authentication-verify-email-v2' } },
      // { name: 'Two Steps (Basic)', to: { name: 'pages-authentication-two-steps-v1' } },
      // { name: 'Two Steps (Cover)', to: { name: 'pages-authentication-two-steps-v2' } },
    ],
  },
];

const isCurrentRoute = (to: RouteLocationRaw) => {
  return route.matched.some((_route) =>
    _route.path.startsWith(router.resolve(to).path),
  );

  // ℹ️ Below is much accurate approach if you don't have any nested routes
  // return route.matched.some(_route => _route.path === router.resolve(to).path)
};

const isPageActive = computed(() =>
  menuItems.some((item) =>
    item.navItems.some((listItem) => isCurrentRoute(listItem.to)),
  ),
);
</script>

<template>
  <!-- 👉 Navigation drawer for mobile devices  -->
  <VNavigationDrawer v-model="sidebar" width="275" disable-resize-watcher>
    <!-- Nav items -->
    <div>
      <div class="d-flex flex-column gap-y-4 pa-4">
        <NuxtLink
          v-for="(item, index) in navMenuItems"
          :key="index"
          :to="item.link"
          class="nav-link font-weight-medium"
          :class="[route.path === item.link ? 'active-link' : '']"
        >
          {{ item.label }}
        </NuxtLink>

        <div class="font-weight-medium cursor-pointer">
          <div
            :class="[
              isMenuOpen ? 'mb-6 active-link' : '',
              isPageActive ? 'active-link' : '',
            ]"
            style="color: rgba(var(--v-theme-on-surface))"
            class="page-link"
            @click="isMenuOpen = !isMenuOpen"
          >
            Menu
            <VIcon
              :icon="isMenuOpen ? 'tabler-chevron-up' : 'tabler-chevron-down'"
            />
          </div>

          <div class="px-4" :class="isMenuOpen ? 'd-block' : 'd-none'">
            <div v-for="(item, index) in menuItems" :key="index">
              <div class="d-flex align-center gap-x-3 mb-4">
                <VAvatar
                  variant="tonal"
                  color="primary"
                  rounded
                  :icon="item.listIcon"
                />
                <div class="text-body-1 text-high-emphasis font-weight-medium">
                  {{ item.listTitle }}
                </div>
              </div>
              <ul class="mb-6">
                <li
                  v-for="listItem in item.navItems"
                  :key="listItem.name"
                  style="list-style: none"
                  class="text-body-1 mb-4 text-no-wrap"
                >
                  <NuxtLink
                    :to="listItem.to"
                    class="mega-menu-item"
                    :class="
                      isCurrentRoute(listItem.to)
                        ? 'active-link'
                        : 'text-high-emphasis'
                    "
                  >
                    <VIcon icon="tabler-circle" :size="10" class="me-2" />
                    <span> {{ listItem.name }}</span>
                  </NuxtLink>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <NavbarThemeSwitcher />

        <!-- <NuxtLink to="/" target="_blank" class="font-weight-medium nav-link">
          Admin
        </NuxtLink> -->
      </div>
    </div>

    <!-- Navigation drawer close icon -->
    <VIcon
      id="navigation-drawer-close-btn"
      icon="tabler-x"
      size="20"
      @click="sidebar = !sidebar"
    />
  </VNavigationDrawer>

  <!-- 👉 Navbar for desktop devices  -->
  <div class="front-page-navbar">
    <div class="front-page-navbar">
      <VAppBar
        :color="
          $vuetify.theme.current.dark
            ? 'rgba(var(--v-theme-surface),0.38)'
            : 'rgba(var(--v-theme-surface), 0.38)'
        "
        :class="
          y > 10
            ? 'app-bar-scrolled'
            : [
                $vuetify.theme.current.dark ? 'app-bar-dark' : 'app-bar-light',
                'elevation-0',
              ]
        "
        class="navbar-blur"
      >
        <!-- toggle icon for mobile device -->
        <IconBtn
          id="vertical-nav-toggle-btn"
          class="ms-n3 me-2 d-inline-block d-md-none"
          @click="sidebar = !sidebar"
        >
          <VIcon
            size="26"
            icon="tabler-menu-2"
            color="rgba(var(--v-theme-on-surface))"
          />
        </IconBtn>
        <!-- Title and Landing page sections -->
        <div class="d-flex align-center">
          <VAppBarTitle class="me-6">
            <NuxtLink
              :to="routes.home"
              class="d-flex gap-x-4"
              :class="$vuetify.display.mdAndUp ? 'd-none' : 'd-block'"
            >
              <div class="app-logo">
                <VNodeRenderer :nodes="themeConfig.app.logo" />
                <h1 class="app-logo-title">
                  {{ themeConfig.app.title }}
                </h1>
              </div>
            </NuxtLink>
          </VAppBarTitle>

          <!-- landing page sections -->
          <div class="text-base align-center d-none d-md-flex">
            <NuxtLink
              v-for="(item, index) in navMenuItems"
              :key="index"
              :to="item.link"
              class="nav-link font-weight-medium py-2 px-2 px-lg-4"
              :class="[route.path === item.link ? 'active-link' : '']"
            >
              {{ item.label }}
            </NuxtLink>

            <!-- Pages Menu -->
            <span
              class="font-weight-medium cursor-pointer px-2 px-lg-4 py-2"
              :class="isPageActive || isMegaMenuOpen ? 'active-link' : ''"
              style="color: rgba(var(--v-theme-on-surface))"
            >
              Menu
              <VIcon icon="tabler-chevron-down" size="16" class="ms-2" />
              <VMenu
                v-model="isMegaMenuOpen"
                open-on-hover
                activator="parent"
                transition="slide-y-transition"
                location="bottom center"
                offset="16"
                content-class="mega-menu"
                location-strategy="static"
                close-on-content-click
              >
                <VCard max-width="1000">
                  <VCardText class="pa-8">
                    <div class="nav-menu">
                      <div v-for="(item, index) in menuItems" :key="index">
                        <div class="d-flex align-center gap-x-3 mb-6">
                          <VAvatar
                            variant="tonal"
                            color="primary"
                            rounded
                            :icon="item.listIcon"
                          />
                          <div
                            class="text-body-1 text-high-emphasis font-weight-medium"
                          >
                            {{ item.listTitle }}
                          </div>
                        </div>
                        <ul>
                          <li
                            v-for="listItem in item.navItems"
                            :key="listItem.name"
                            style="list-style: none"
                            class="text-body-1 mb-4 text-no-wrap"
                          >
                            <NuxtLink
                              class="mega-menu-item"
                              :to="listItem.to"
                              :class="
                                isCurrentRoute(listItem.to)
                                  ? 'active-link'
                                  : 'text-high-emphasis'
                              "
                            >
                              <div class="d-flex align-center">
                                <VIcon
                                  icon="tabler-circle"
                                  color="primary"
                                  :size="10"
                                  class="me-2"
                                />
                                <span>{{ listItem.name }}</span>
                              </div>
                            </NuxtLink>
                          </li>
                        </ul>
                      </div>
                      <img
                        :src="navImg"
                        alt="Navigation Image"
                        class="d-inline-block rounded-lg"
                        style="
                          border: 10px solid rgb(var(--v-theme-background));
                        "
                        :width="$vuetify.display.lgAndUp ? '330' : '250'"
                        :height="$vuetify.display.lgAndUp ? '330' : '250'"
                      />
                    </div>
                  </VCardText>
                </VCard>
              </VMenu>
            </span>
          </div>
        </div>

        <VSpacer />

        <div class="d-flex gap-x-4">
          <NavSearchBar v-if="!route.meta?.disableSearchbar" />
          <NavbarThemeSwitcher v-if="$vuetify.display.mdAndUp" />

          <!-- <VBtn v-if="$vuetify.display.lgAndUp" prepend-icon="tabler-shopping-cart" variant="elevated" color="primary"
            href="https://1.envato.market/vuexy_admin" target="_blank" rel="noopener noreferrer">
            Login
          </VBtn> -->
          <NavBarNotifications v-if="user" />
          <UserProfile v-if="user" />
          <VBtn
            v-else
            prepend-icon="tabler-lock"
            variant="elevated"
            color="primary"
            :to="routes.auth.login"
            rel="noopener noreferrer"
          >
            Login
          </VBtn>
        </div>
      </VAppBar>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.nav-menu {
  display: flex;
  gap: 2rem;
}

.nav-link {
  &:not(:hover) {
    color: rgb(var(--v-theme-on-surface));
  }
}

.page-link {
  &:hover {
    color: rgb(var(--v-theme-primary)) !important;
  }
}

@media (max-width: 1280px) {
  .nav-menu {
    gap: 2.25rem;
  }
}

@media (min-width: 1920px) {
  .front-page-navbar {
    .v-toolbar {
      max-inline-size: calc(1440px - 32px);
    }
  }
}

@media (min-width: 1280px) and (max-width: 1919px) {
  .front-page-navbar {
    .v-toolbar {
      max-inline-size: calc(1200px - 32px);
    }
  }
}

@media (min-width: 960px) and (max-width: 1279px) {
  .front-page-navbar {
    .v-toolbar {
      max-inline-size: calc(900px - 32px);
    }
  }
}

@media (min-width: 600px) and (max-width: 959px) {
  .front-page-navbar {
    .v-toolbar {
      max-inline-size: calc(100% - 64px);
    }
  }
}

@media (max-width: 600px) {
  .front-page-navbar {
    .v-toolbar {
      max-inline-size: calc(100% - 32px);
    }
  }
}

.nav-item-img {
  border: 10px solid rgb(var(--v-theme-background));
  border-radius: 10px;
}

.active-link {
  color: rgb(var(--v-theme-primary)) !important;
}

.app-bar-light {
  border: 2px solid rgba(var(--v-theme-surface), 68%);
  border-radius: 0.5rem;
  background-color: rgba(var(--v-theme-surface), 38%);
  transition: all 0.1s ease-in-out;
}

.app-bar-dark {
  border: 2px solid rgba(var(--v-theme-surface), 68%);
  border-radius: 0.5rem;
  background-color: rgba(255, 255, 255, 4%);
  transition: all 0.1s ease-in-out;
}

.app-bar-scrolled {
  border-radius: 0.5rem;
  background-color: rgb(var(--v-theme-surface)) !important;
  transition: all 0.1s ease-in-out;
}

.front-page-navbar::after {
  position: fixed;
  z-index: 2;
  backdrop-filter: saturate(100%) blur(6px);
  block-size: 5rem;
  content: "";
  inline-size: 100%;
}
</style>

<style lang="scss">
@use "@layouts/styles/mixins" as layoutMixins;

.mega-menu {
  position: fixed !important;
  inset-block-start: 5.4rem;
  inset-inline-start: 50%;
  transform: translateX(-50%);

  @include layoutMixins.rtl {
    transform: translateX(50%);
  }
}

.front-page-navbar {
  .v-toolbar__content {
    padding-inline: 30px !important;
  }

  .v-toolbar {
    inset-inline: 0 !important;
    margin-block-start: 1rem !important;
    margin-inline: auto !important;
  }
}

.mega-menu-item {
  &:hover {
    color: rgb(var(--v-theme-primary)) !important;
  }
}

#navigation-drawer-close-btn {
  position: absolute;
  cursor: pointer;
  inset-block-start: 0.5rem;
  inset-inline-end: 1rem;
}
</style>
