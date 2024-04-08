import Razorpay from 'razorpay'
import Env from '@ioc:Adonis/Core/Env'
// import Booking from 'App/Models/bookings/Booking'
// import BidBooking from 'App/Models/bookings/BidBooking'
// import { PaymentStatus } from 'App/Helpers/enums'
// import Payment from 'App/Models/Payment'

class PaymentGateway {
  public razor: Razorpay
  private booted = false

  public boot() {
    /**
     * Ignore multiple calls to the boot method
     */
    if (this.booted) {
      return
    }

    this.booted = true
    this.razor = new Razorpay({
      key_id: Env.get('RAZOR_KEY_ID'),
      key_secret: Env.get('RAZOR_KEY_SECRETE'),
    })
  }

  // async createOrder(
  //   booking: Booking | BidBooking,
  //   cbs: { onSuccess: () => void; onError: (err: any) => void }
  // ) {
  //   if (booking instanceof Booking) {
  //     this.razor.orders.create(
  //       {
  //         amount: booking.bookingDetail.grand_total,
  //         currency: 'inr',
  //         customer_id: booking.userId.toString(),
  //         notes: {},
  //         receipt: `REG-${booking.id}`,
  //         partial_payment: true,
  //       },
  //       async (err, data) => {
  //         if (err) {
  //           cbs?.onError(err)
  //         }

  //         if (data) {
  //           await booking.related('payment').create({
  //             amount: data?.amount as unknown as string,
  //             amountDue: data.amount_due as unknown as string,
  //             amountPaid: data.amount_paid as unknown as string,
  //             currency: data.currency,
  //             status: PaymentStatus.PENDING,
  //             gatewayData: data,
  //           })

  //           cbs?.onSuccess()
  //         }
  //       }
  //     )
  //   }

  //   if (booking instanceof BidBooking) {
  //     this.razor.orders.create(
  //       {
  //         amount: booking.price,
  //         currency: 'inr',
  //         customer_id: booking.userId.toString(),
  //         notes: {},
  //         receipt: `REG-${booking.id}`,
  //         partial_payment: true,
  //       },
  //       async (err, data) => {
  //         if (err) {
  //           cbs?.onError(err)
  //         }

  //         if (data) {
  //           await booking.related('payment').create({
  //             amount: data?.amount as unknown as string,
  //             amountDue: data.amount_due as unknown as string,
  //             amountPaid: data.amount_paid as unknown as string,
  //             currency: data.currency,
  //             status: PaymentStatus.PENDING,
  //             gatewayData: data,
  //           })
  //           cbs?.onSuccess()
  //         }
  //       }
  //     )
  //   }
  // }

  // async createPayment(data: Parameters<Parameters<typeof this.razor.orders.create>['1']>['1']) {
  //   const payment = await Payment.create({
  //     amount: data?.amount as unknown as string,
  //     amountDue: data.amount_due as unknown as string,
  //     amountPaid: data.amount_paid as unknown as string,
  //     currency: data.currency,
  //     status: PaymentStatus.PENDING,
  //     gatewayData: data,
  //   })

  //   return payment
  // }

  // async updatePayment(payment:Payment,opt:{gateway_payment_id:number}) {
  //   this.razor.payments.fetch(opt.gateway_payment_id).then((data)=>)

  //   const payment = await Payment.create({
  //     amount: data?.amount as unknown as string,
  //     amountDue: data.amount_due as unknown as string,
  //     amountPaid: data.amount_paid as unknown as string,
  //     currency: data.currency,
  //     status:
  //       data.status === 'created'
  //         ? PaymentStatus.PENDING
  //         : data.status === 'attempted'
  //           ? PaymentStatus.PENDING
  //           : data.status === 'paid'
  //             ? PaymentStatus.PAID
  //             : PaymentStatus.PENDING,
  //     gatewayData: data,
  //   })

  //   return payment
  // }
}

export default new PaymentGateway()
