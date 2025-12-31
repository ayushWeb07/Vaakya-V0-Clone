import { Spotlight } from "@/components/ui/spotlight-new";
import { PricingTable } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

export default function PricingPage() {
  return (
    <div className="relative overflow-hidden bg-background py-40 min-h-screen">
      <Spotlight />
      <div className="mx-auto w-6xl px-6">
        {/* Header */}
        <div className="mb-16 text-center">
          <span className="mb-4 inline-block rounded-full border border-border bg-muted px-4 py-1 text-sm text-muted-foreground">
            Simple, transparent pricing
          </span>

          <h1 className="mt-4 text-5xl font-bold tracking-tight text-foreground">
            Pricing that scales with you
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            Choose a plan that fits your needs. Upgrade, downgrade, or cancel at
            any time. No hidden fees.
          </p>
        </div>

        {/* Pricing Table */}
        <div className="flex justify-center">
          <PricingTable
            appearance={{
              theme: dark,
              elements: {
                pricingTable: "gap-6",
                pricingTableCard:
                  "bg-popover! border border-border rounded-2xl shadow-lg shadow-black/30 transition-all hover:border-primary/50",
                pricingTableCardHeader: "border-b border-border pb-4",
                pricingTableCardTitle: "text-xl font-semibold text-foreground",
                pricingTableCardPrice: "text-4xl font-bold text-foreground",
                pricingTableCardDescription: "text-muted-foreground",
                pricingTableCardButton:
                  "rounded-xl bg-background text-primary-foreground hover:bg-primary/90 transition-colors",
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}
