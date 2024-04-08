const createBaseRoutes = (url: string) => {
  return {
    list: url,
    view: (id: number) => `${url}/${id}`,
    create: url,
    update: (id: number) => `${url}/${id}`,
    delete: (id: number) => `${url}/${id}`,
  };
};

const apiRoutes = {
  auth: {
    updatePassword: (userId: number) => `/api/auth/update-password/${userId}`,
  },
  vendor_user: {
    ...createBaseRoutes("/api/vendor-users"),
    update_profile: (id: number) => `/api/vendor-users/${id}/update-profile`,
    reviews: (vendorId: number) => `/api/vendor-users/${vendorId}/reviews`,
    create_review: (service_id: string) =>
      `/api/vendor-users/${service_id}/reviews`,
  },
  users: {
    ...createBaseRoutes("/api/users"),
    update_profile: (id: number) => `/api/users/${id}/update-profile`,
  },
  service_categories: {
    ...createBaseRoutes("/api/service-category"),
    view_by_slug: (slug: string | number) =>
      `/api/service-category/by-slug/${slug}`,
  },
  services: {
    ...createBaseRoutes("/api/service"),
    view_by_slug: (slug: string | number) => `/api/service/by-slug/${slug}`,
    my_list: '/api/service/my-list',
    reviews: (service_id: string | number) =>
      `/api/service/${service_id}/reviews`,
    create_review: (service_id: string) => `/api/service/${service_id}/reviews`,
    deleteImage: (id: number) => `/api/service/delete-screenshot/${id}`
  },
  service_subcategories: {
    ...createBaseRoutes("/api/service-subcategory"),
    view_by_slug: (slug: string | number) =>
      `/api/service-subcategory/by-slug/${slug}`,
  },
  service_tags: {
    ...createBaseRoutes("/api/service-tags"),
    view_by_slug: (slug: string | number) =>
      `/api/service-tags/by-slug/${slug}`,
  },
  bookings: {
    ...createBaseRoutes("/api/bookings"),
    for_customer: "/api/bookings/customer-bookings",
    for_vendnor: "/api/bookings/vendor-bookings",
    summary: "/api/bookings/summary",
    get_coupons: (variantId: number) =>
      `/api/bookings/get-coupons?serviceVariantId=${variantId}`,
  },
  service_requirements: {
    ...createBaseRoutes("/api/service-requirements"),
    my_list: "/api/service-requirements/my-list",
    show_bids: (requirementId: number) =>
      `/api/service-requirements/${requirementId}/show-bids`,
    show_accepted_bid: (requirementId: number) =>
      `/api/service-requirements/${requirementId}/accepted-bid`,
  },
  bids: {
    ...createBaseRoutes("/api/bids"),
  },
  bid_booking: {
    ...createBaseRoutes("/api/bid-bookings"),
    my_list: "/api/bid-bookings/my-list",
  },
  service_variants: {
    ...createBaseRoutes("/api/service-variants"),
  },
  chat: {
    conversations: {
      list: "/api/chat/conversations/",
      create: "/api/chat/conversations/",
      messages: (converstaionId: number) =>
        `/api/chat/conversations/${converstaionId}/get-messages`,
      create_message: (converstaionId: number) =>
        `/api/chat/conversations/${converstaionId}/create-message`,
    },
  },
};

export default apiRoutes;
