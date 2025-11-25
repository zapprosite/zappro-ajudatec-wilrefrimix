'use client'
import WebLanding from '../components/WebLanding'

export default function Page() {
  const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  const pricingTableId = process.env.NEXT_PUBLIC_STRIPE_PRICING_TABLE_ID

  return (
    <main id="main" className="min-h-screen bg-white">
      <WebLanding />
      {publishableKey && pricingTableId ? (
        <section className="max-w-5xl mx-auto p-8">
          <stripe-pricing-table pricing-table-id={pricingTableId} publishable-key={publishableKey}></stripe-pricing-table>
        </section>
      ) : (
        <section className="max-w-5xl mx-auto p-8">
          <a href="https://checkout.stripe.com/test" className="inline-block bg-emerald-800 text-white px-4 py-2 rounded">Assinar</a>
        </section>
      )}
    </main>
  )
}
