import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient as createServerClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-03-25.dahlia',
})

// Use service role for webhook (bypasses RLS)
function getAdminClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
    // In development without webhook secret, still process the event
    try {
      const event = JSON.parse(body) as Stripe.Event
      await handleEvent(event)
      return NextResponse.json({ received: true })
    } catch {
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
    }
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  await handleEvent(event)
  return NextResponse.json({ received: true })
}

async function handleEvent(event: Stripe.Event) {
  const supabase = getAdminClient()

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      const userId = (session.metadata as Record<string, string>)?.supabase_user_id

      if (!userId || !session.subscription) break

      const subscription = await stripe.subscriptions.retrieve(session.subscription as string)

      // Update profile plan to premium
      await supabase
        .from('profiles')
        .update({ plan: 'premium', updated_at: new Date().toISOString() })
        .eq('id', userId)

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const sub = subscription as any

      // Create subscription record
      await supabase.from('subscriptions').upsert({
        user_id: userId,
        stripe_subscription_id: subscription.id,
        stripe_price_id: subscription.items.data[0]?.price.id,
        plan: 'premium',
        status: subscription.status,
        current_period_end: sub.current_period_end
          ? new Date(sub.current_period_end * 1000).toISOString()
          : null,
      })
      break
    }

    case 'customer.subscription.deleted': {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const subscription = event.data.object as any
      const userId = subscription.metadata?.supabase_user_id

      if (userId) {
        await supabase
          .from('profiles')
          .update({ plan: 'free', updated_at: new Date().toISOString() })
          .eq('id', userId)

        await supabase
          .from('subscriptions')
          .update({
            status: 'canceled',
            canceled_at: new Date().toISOString(),
          })
          .eq('stripe_subscription_id', subscription.id)
      }
      break
    }

    case 'customer.subscription.updated': {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const subscription = event.data.object as any
      const userId = subscription.metadata?.supabase_user_id

      if (userId) {
        const plan = subscription.status === 'active' || subscription.status === 'trialing'
          ? 'premium'
          : 'free'

        await supabase
          .from('profiles')
          .update({ plan, updated_at: new Date().toISOString() })
          .eq('id', userId)

        await supabase
          .from('subscriptions')
          .update({
            status: subscription.status,
            current_period_end: subscription.current_period_end
              ? new Date(subscription.current_period_end * 1000).toISOString()
              : null,
          })
          .eq('stripe_subscription_id', subscription.id)
      }
      break
    }
  }
}
