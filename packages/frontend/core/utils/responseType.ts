interface IResType<T> {
  data: T;
  message: string;
  success: boolean;
  errors?: {
    field: string;
    message: string;
    rule: string;
  }[];
}

interface PageMeta {
  current_page: number;
  first_page: number;
  first_page_url: string;
  last_page: null | number;
  last_page_url: null | string;
  next_page_url: null | string;
  per_page: number;
  previous_page_url: null | string;
  total: number;
}

interface IPageRes<T>
  extends IResType<{
    data: T;
    meta: PageMeta;
  }> {}

interface ImageType {
  name: string;
  size: number;
  hash: string;
  width: number;
  format: string;
  height: number;
  extname: string;
  mimeType: string;
  url: string;
  breakpoints: {
    thumbnail: {
      url: string;
      name: string;
      hash: string;
      extname: string;
      mimeType: string;
      width: number;
      height: number;
      size: number;
    };
  };
}

interface Image {
  id: number;
  file: ImageType;
  service_id: number;
  vendor_profile_id: number;
  service_requiremet_id: number;
  media_id: number;
}

interface TimeStamps {
  created_at: string;
  updated_at: string;
}

type IServiceCategory = {
  id: number;
  name: string;
  slug: string;
  short_desc: string | null;
  long_desc: string | null;
  status: string | null;
  thumbnail: ImageType | null;
  meta: any;
} & TimeStamps;

type IServiceSubcategory = {
  id: number;
  name: string;
  slug: string;
  short_desc: string | null;
  long_desc: string | null;
  status: string | null;
  thumbnail: ImageType | null;
  meta: any;
} & TimeStamps;

type IService = {
  id: number;
  name: string;
  slug: string;
  short_desc: string | null;
  long_desc: string | null;
  is_active: boolean;
  location_specific: boolean;
  geo_location: {
    x: number;
    y: number;
  };
  avg_rating: string;
  video: ImageType | null;
  images: Image[] | null;
  thumbnail: ImageType;
  vendor_user_id: number;
  vendorUser: IVendorUser;
  service_category_id: number;
  serviceCategory: IServiceCategory;
  service_subcategory_id: number;
  serviceSubcategory: IServiceSubcategory;
  variants: IServiceVariant[];
  seo: ISeo;
  tags: IServiceTag[];
  reviews: IReview[];
  faq: IFaq[];
  meta: Record<any, any>;
} & TimeStamps;

interface IServiceVariant {
  id: number;
  name: string;
  price: string | number;
  discount_type: "flat" | "percentage";
  discount_flat: string | number;
  discount_percentage: string | number;
  desc: string;
  order: number;
  image: ImageType | null;
  service_id: number;
  service: IService;
  meta: any;
}

type IServiceTag = {
  id: number;
  name: string;
  slug: string;
  shortDesc: string;
  longDesc: string;
  status: boolean;
  thumbnail: ImageType;
  faqs: IFaq[];
  seo: ISeo;
} & TimeStamps;

type IVendorProfile = {
  id: number;
  name: string;
  short_desc: string;
  long_desc: string;
  is_active: boolean;
  avatar: ImageType;
  logo: ImageType;
  video: ImageType;
  vendor_user_id: number;
  images: ImageType[];
  seo: ISeo;
  social: ISocial;
  faq: IFaq[];
  addresses: IAddress[];
  vendor: IVendorUser;
  meta: any;
} & TimeStamps;

interface ISeo {
  id: number;
  meta_title: string;
  meta_keywords: string;
  meta_desc: string;
}

interface ISocial {
  id: number;
  website: string;
  facebook: string;
  twitter: string;
  instagram: string;
  pintrest: string;
  linkedin: string;
  vk: string;
  whatsapp: string;
  telegram: string;
}

interface IFaq {
  id: number;
  quest: string;
  ans: string;
  service_subcategory_id: number;
  service_category_id: number;
  service_id: number;
  service_tag_id: number;
  vendorProfileId: number;
  meta: any;
}

interface IAddress {
  id: number;
  address: string;
  geo_location: {
    x: number;
    y: number;
  };
  user_profile_id: number;
  vendor_profile_id: number;
}

type IReview = {
  id: number;
  rating: number;
  message: string;
  user_id: number;
  vendor_user_id: number;
  service_id: number;
  user: IUser;
  vendorUser: IVendorUser;
  service: IService;
  meta: any;
} & TimeStamps;

type IVendorUser = {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  business_name: string;
  phone: string;
  is_active: boolean;
  avg_rating: string;
  token: string | null;
  socket_token: string;
  userType: "vendor";
  profile: IVendorProfile;
  bookings: IBooking[];
  notifications: INotification[];
  subscribed_categories: IServiceCategory[];
  bid_booking: IBidBooking[];
  reviews: IReview[];
  services: IService[];
  blogs: IBlog[];
  meta: any;
} & TimeStamps;

type IUser = {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  is_active: boolean;
  token: string | null;
  socket_token: string;
  userType: "user";
  profile: IProfile;
  wishlist: IWishlist;
  bookings: IBooking[];
  notifications: INotification[];
  bid_booking: IBooking[];
  blogs: IBlog[];
  meta: any;
} & TimeStamps;

type IAdminUser = {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  is_active: boolean;
  role_id: number;
  token: string | null;
  socket_token: string;
  userType: "admin";
  profile: IProfile;
  role: IRole;
  activities: IActivity[];
  notifications: INotification[];
  meta: any;
} & TimeStamps;

type IRole = {
  id: number;
  name: string;
  is_active: boolean;
  admin_user: IAdminUser[];
  permissions: string[];
  meta: any;
};

type IActivity = {
  id: number;
  name: string;
  admin_user_id: number;
  created_at: string;
  meta: any;
};

type IProfile = {
  id: number;
  avatar: ImageType;
  user_id: number;
  admin_user_id: number;
  notification_setting: Object;
  user: IUser;
  social: ISocial;
  addresses: IAddress;
  languages: ILanguage[];
  skills: ISkill[];
  meta: any;
};

type ILanguage = {
  id: number;
  name: string;
  meta: any;
};

type ISkill = {
  id: number;
  name: string;
  desc: string;
  meta: any;
};

type IBooking = {
  id: number;
  service_variant_id: number;
  user_id: number;
  vendor_user_id: number;
  booking_detail: {
    service_variant: {
      id: number;
      qty: number;
      name: string;
      price: string;
      image: ImageType;
      service_id: number;
      service_name: string;
    };
    total_without_discount: string;
    vendor_discount: string;
    total_after_discount: string;
    coupon_discount: string;
    grand_total: string;
  };
  payment_detail: {};
  history: { date_time: string; event: string; remarks: string }[];
  status: string;
  vendor_user: IVendorUser;
  user: IUser;
  service_variant: IServiceVariant;
  meta: any;
} & TimeStamps;

type IBidBooking = {
  id: number;
  qty: number;
  price: number;
  user_id: number;
  vendor_user_id: number;
  booking_detail: {
    serviceRequirement: {
      id: number;
      title: string;
      desc: string;
      budgetType: string;
      budget: string;
    };
    acceptedBid: {
      id: number;
      offeredPrice: string;
    };
  };
  payment_detail: {};
  history: { date_time: string; event: string; remarks: string }[];
  status: string;
  vendor_user: IVendorUser;
  user: IUser;
  meta: any;
} & TimeStamps;

type INotification = {
  id: number;
  data: {
    type: string;
    message: string;
    meta: Record<any, any>;
  };
  user_id: number;
  admin_user_id: number;
  vendor_user_id: number;
  read_at: string;
  meta: any;
} & TimeStamps;

type IWishlist = {
  id: number;
  user_id: number;
  items: IServiceVariant[];
  meta: any;
};

type IBookingSummary = {
  coupon_discount: string;
  grand_total: string;
  qty: number;
  service_variant: IServiceVariant;
  total_after_discount: string;
  total_without_discount: string;
  vendor_discount: string;
  meta: any;
};

type IServiceRequirement = {
  id: number;
  title: string;
  desc: string;
  urgent: boolean;
  budget_unit: string;
  budget: string | number;
  expires_at: string;
  location: string;
  user_id: number;
  service_category_id: number;
  accepted_bid_id: number;
  user: IUser;
  serviceCategory: IServiceCategory;
  recievedBids: IBid;
  meta: Record<any, any>;
  images: Image[];
  tags: IServiceTag[];
} & TimeStamps;

type IBid = {
  id: number;
  offered_price: number | string;
  message: string;
  negotiate_history: {
    date_time: string;
    asked_price: string;
    message: string;
    accepted: boolean;
  }[];
  service_requirement_id: number;
  vendor_user_id: number;
  vendorUser: IVendorUser;
  serviceRequirement: IServiceRequirement;
  meta: any;
} & TimeStamps;

type ICoupon = {
  coupon_type: string;
  created_at: string;
  desc: string;
  discount_flat: string;
  discount_percentage: string;
  discount_type: string;
  expired_at: string;
  id: number;
  max_users: number;
  min_purchase_amount: string;
  name: string;
  updated_at: string;
  valid_from: string;
  vendor_user_id: number;
};

type IConversation = {
  id: number;
  name: string;
  participant_one_id: number;
  participant_two_id: number;
  participant_one_identifier: string;
  participant_two_identifier: string;
  participantOne: IConversationParticipant;
  participantTwo: IConversationParticipant;
  messages: IMessage[];
  created_at: string;
};

type IConversationParticipant = {
  id: number;
  user_identifier: string;
  userId: number;
  vendor_user_id: number;
  admin_user_id: number;
  adminUser: IAdminUser;
  vendorUser: IVendorUser;
  user: IUser;
} & TimeStamps;

type IMessage = {
  id: number;
  body: string;
  user_identifier: string;
  read: boolean;
  conversation_id: number;
  conversation: IConversation;
} & TimeStamps;

type IBlogCategory = {
  id: number;
  name: string;
  slug: string;
  order: number;
  status: boolean;
  languageId: number;
  language: ILanguage;
  metaTitle: string;
  metaKeywords: string;
  metaDesc: string;
  blogs: IBlog[];
};

type IBlog = {
  id: number;
  title: string;
  slug: string;
  thumbnail: ImageType;
  category: IBlogCategory;
  vendorUser: IAdminUser;
  languageId: number;
  language: ILanguage;
  longDesc: string;
  isPublished: boolean;
  metaTitle: string;
  metaKeywords: string;
  metaDesc: string;
} & TimeStamps;
