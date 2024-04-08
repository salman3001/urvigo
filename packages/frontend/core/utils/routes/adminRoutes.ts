export default {
  admin: {
    dashboard: "/admin",
    admin_users: "/admin/admin-users",
    admin_users_show: (id: string) => `/admin/admin-users/${id}`,
    admin_users_create: `/admin/admin-users/create`,
    admin_users_edit: (id: string) => `/admin/admin-users/${id}/edit`,
    admin_users_activity_log: (id: string) =>
      `/admin/admin-users/${id}?activity=true`,
    roles: "/admin/roles",
    roles_edit: (id: string) => `/admin/roles/${id}/edit`,
    knowlegdebase: {
      content: "/admin/help-center/knowledgebase/content",
      content_create: "/admin/help-center/knowledgebase/content/create",
      content_show: (id: string) =>
        `/admin/help-center/knowledgebase/content/${id}`,
      content_edit: (id: string) =>
        `/admin/help-center/knowledgebase/content/${id}/edit`,
      category: "/admin/help-center/knowledgebase/category",
      category_create: "/admin/help-center/knowledgebase/category/create",
      category_show: (id: string) =>
        `/admin/help-center/knowledgebase/category/${id}`,
      category_edit: (id: string) =>
        `/admin/help-center/knowledgebase/category/${id}/edit`,
    },
    help_center: {
      contact_message: "/admin/help-center/contact-message",
      support_ticket: "/admin/help-center/support-ticket",
      support_ticket_create: "/admin/help-center/support-ticket/create",
      support_ticket_chat: (id: string) =>
        `/admin/help-center/support-ticket/${id}/chat`,
    },
    blogs: {
      posts: "/admin/blogs/posts",
      posts_create: "/admin/blogs/posts/create",
      posts_show: (id: string) => `/admin/blogs/posts/${id}`,
      posts_edit: (id: string) => `/admin/blogs/posts/${id}/edit`,
      category: "/admin/blogs/category",
      category_create: "/admin/blogs/category/create",
      category_show: (id: string) => `/admin/blogs/category/${id}`,
      category_edit: (id: string) => `/admin/blogs/category/${id}/edit`,
    },
    location: {
      continents: "/admin/location/continents",
      countries: "/admin/location/countries",
      states: "/admin/location/states",
      cities: "/admin/location/cities",
      streets: "/admin/location/streets",
    },
    users: "/admin/users",
    user_create: "/admin/users/create",
    user_show: (id: string) => `/admin/users/${id}`,
    user_edit: (id: string) => `/admin/users/${id}/edit`,
    product: {
      index: "/admin/product",
      create: "/admin/product/create",
      show: (id: string) => `/admin/product/${id}`,
      edit: (id: string) => `/admin/product/${id}/edit`,
      category: {
        index: "/admin/product/category",
        create: "/admin/product/category/create",
        show: (id: string) => `/admin/product/category/${id}`,
        edit: (id: string) => `/admin/product/category/${id}/edit`,
      },
      sub_category: {
        index: "/admin/product/sub-category",
        create: "/admin/product/sub-category/create",
        show: (id: string) => `/admin/product/sub-category/${id}`,
        edit: (id: string) => `/admin/product/sub-category/${id}/edit`,
      },
      tag: {
        index: "/admin/product/tag",
        create: "/admin/product/tag/create",
        show: (id: string) => `/admin/product/tag/${id}`,
        edit: (id: string) => `/admin/product/tag/${id}/edit`,
      },
    },
    service: {
      index: "/admin/service",
      create: "/admin/service/create",
      show: (id: string) => `/admin/service/${id}`,
      edit: (id: string) => `/admin/service/${id}/edit`,
      category: {
        index: "/admin/service/category",
        create: "/admin/service/category/create",
        show: (id: string) => `/admin/service/category/${id}`,
        edit: (id: string) => `/admin/service/category/${id}/edit`,
      },
      sub_category: {
        index: "/admin/service/sub-category",
        create: "/admin/service/sub-category/create",
        show: (id: string) => `/admin/service/sub-category/${id}`,
        edit: (id: string) => `/admin/service/sub-category/${id}/edit`,
      },
      tag: {
        index: "/admin/service/tag",
        create: "/admin/service/tag/create",
        show: (id: string) => `/admin/service/tag/${id}`,
        edit: (id: string) => `/admin/service/tag/${id}/edit`,
      },
    },
    campaigns: {
      index: "/admin/news-letters/campaign",
      create: "/admin/news-letters/campaign/create",
      show: (id: string) => `/admin/news-letters/campaign/${id}`,
      edit: (id: string) => `/admin/news-letters/campaign/${id}/edit`,
    },
    templates: {
      index: "/admin/news-letters/templates",
      create: "/admin/news-letters/templates/create",
      show: (id: string) => `/admin/news-letters/templates/${id}`,
      edit: (id: string) => `/admin/news-letters/templates/${id}/edit`,
    },
    subscribers: {
      index: "/admin/news-letters/subscribers",
      create: "/admin/news-letters/subscribers/create",
      show: (id: string) => `/admin/news-letters/subscribers/${id}`,
      edit: (id: string) => `/admin/news-letters/subscribers/${id}/edit`,
    },
    media: {
      images: "/admin/media/images",
      videos: "/admin/media/videos",
    },
    notifications: "/admin/notifications",
  },
};
