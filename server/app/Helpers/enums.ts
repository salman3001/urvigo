export enum TicketStatus {
  OPEN = 'Open',
  CLOSED = 'Closed',
  RESPONDED = 'Responded',
}

export enum ServiceLocationType {
  SPECIFIC = 'Specific',
  PHYSICAL = 'Physical',
}

export enum permissions {
  MANAGE_ADMIN_USERS = 'Manage Admin Users',
  MANAGE_BLOGS = 'Manage Blogs',
  MANAGE_CAMPAIGNS = 'Manage Campains',
  MANAGE_SUBSCRIBERS = 'Manage Subscribers',
  MANAGE_INTERESTS = 'Manage Intrests',
  MANAGE_TEMPLATES = 'Manage Templates',
  MANAGE_CONTACT_MESSAGES = 'Manage Cotact Messages',
  MANAGE_KNOWLEDGEBASE = 'Manage Knowledgebase',
  MANAGE_TICKETS = 'Manage Support Tickets',
  MANAGE_PRODUCT = 'Manage Services',
  MANAGE_SERVICE = 'Manage Services',
  MANAGE_USER = 'Manage Users',
  MANAGE_LOCATION = 'Manage Location',
  MANAGE_ROLES = 'Manage Roles',
  MANAGE_MEDIA = 'Manage Media',
  MANAGE_BUSINESS = 'Manage Business',
  MANAGE_BOOKINGS = 'Manage Bookings',
  MANAGE_BID_BOOKINGS = 'Manage Bid Bookings',
  MANAGE_COUPONS = 'Manage Coupons',
}

export enum NotificationTypes {
  NEW_SUPPORT_TICKET = 'new-support-ticket',
  BOOKING_CREATED = 'booking-created',
  BOOKING_RECIEVED = 'booking-recieved',
  SERVICE_REQUIREMENT_ADDED = 'service_requirement-added',
  BID_RECIEVED = 'bid-recieved',
}

export enum MediaTypes {
  VIDEO = 'Video',
  IMAGE = 'Image',
}

export enum OrderStatus {
  PLACED = 'placed',
  CONFIRMED = 'confirmed',
  CANCELED = 'canceled',
  DELIVERED = 'delivered',
}

export enum userTypes {
  USER = 'user',
  ADMIN = 'admin',
  VENDER = 'vendor',
}

export enum CouponType {
  VENDOR = 'vendor',
  ADMIN = 'admin',
}

export enum DiscountType {
  FLAT = 'flat',
  PERCENATAGE = 'percentage',
}

export enum BudgetType {
  HOURLY = 'hourly',
  FIXED = 'fixed',
}

export enum PaymentStatus {
  PENDING = 'pending',
  PARTIAL_PAiD = 'partial paid',
  PAID = 'paid',
}

export enum PaymentMode {
  ONLINE = 'online',
  COD = 'cod',
}
