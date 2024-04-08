import { ResponsiveAttachmentContract } from '@ioc:Adonis/Addons/ResponsiveAttachment'

export interface OrderItem {
  qty: number
  serviceVariant: {
    service_id: number
    service_name: string
    disocunt_type: string
    disocunt_flat: string
    disocunt_percentage: string
    id: number
    name: string
    price: string
  }
  item_total_without_discount: string
  item_discount: string
  item_total: string
}

export interface IOrderGroupsByVender {
  [key: string]: {
    vendorId: number
    items: OrderItem[]
    order_total_without_discount: string
    order_total_discount: string
    coupon_discount: string
    order_total: string
  }
}

export interface IOrderGroup {
  vendorId: number
  items: OrderItem[]
  orderNo: number
  order_total: string
  coupon_discount: string
  order_total_without_discount: string
  order_total_discount: string
}

export interface IOrderGroupWithDiscount {
  orders: IOrderGroup[]
  grand_total_without_discount: string
  grand_total_discount: string
  grand_total_coupon_discount: string
  grand_total: string
}

export interface IBookingDetail {
  service_variant: {
    id: number
    qty: number
    name: string
    price: string | number
    image: ResponsiveAttachmentContract
    service_id: number
    service_name: string
  }
  total_without_discount: string | number
  vendor_discount: string | number
  total_after_discount: string | number
  coupon_discount: string | number
  grand_total: string | number
}

export interface RazorPayment {
  id: string
  entity: 'payment'
  amount: number
  currency: string
  status: string
  order_id: string
  invoice_id: string
  international: false
  method: string
  amount_refunded: 0
  refund_status: any
  captured: true
  description: string
  card_id: string
  card: {
    id: string
    entity: string
    name: string
    last4: string
    network: string
    type: string
    issuer: any
    international: boolean
    emi: boolean
    sub_type: string
    token_iin: any
  }
  bank: any
  wallet: any
  vpa: any
  email: string
  contact: string
  notes: string[]
  fee: number
  tax: number
  error_code: any
  error_description: any
  error_source: any
  error_step: any
  error_reason: any
  acquirer_data: {
    auth_code: string
  }
  created_at: number
}
