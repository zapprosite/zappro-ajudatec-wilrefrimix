import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: Request) {
  const t0 = Date.now()
  const secret = process.env.STRIPE_WEBHOOK_SECRET || ''
  if (!secret) {
    return new Response('missing webhook secret', { status: 500 })
  }
  const sig = request.headers.get('stripe-signature') || ''
  const rawBody = await request.text()

  let event: Stripe.Event
  try {
    event = Stripe.webhooks.constructEvent(rawBody, sig, secret)
  } catch {
    return new Response('invalid signature', { status: 400 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  switch (event.type) {
    case 'customer.subscription.created':
    case 'customer.subscription.updated':
    case 'customer.subscription.deleted':
      const subscription = event.data.object as Stripe.Subscription
      await supabase.from('subscriptions').upsert({
        id: subscription.id,
        user_id: subscription.metadata.userId,
        status: subscription.status,
        stripe_customer_id: subscription.customer as string,
        stripe_subscription_id: subscription.id,
        price_id: subscription.items.data[0].price.id,
        current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
        current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
        cancel_at: subscription.cancel_at ? new Date(subscription.cancel_at * 1000).toISOString() : null,
        canceled_at: subscription.canceled_at ? new Date(subscription.canceled_at * 1000).toISOString() : null,
      })
      break
    case 'invoice.payment_succeeded':
      // Optional: handle invoice payment
      break
    default:
      break
  }

  const dur = Date.now() - t0
  if (process.env.NODE_ENV !== 'production') {
    console.log(JSON.stringify({ route: '/api/webhook/stripe', status: 200, duration_ms: dur }))
  }
  return new Response('ok', { status: 200 })
}
