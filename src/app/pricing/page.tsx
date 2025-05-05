"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckIcon, Cross1Icon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";

interface PlanFeature {
  name: string;
  included: {
    free: boolean;
    premium: boolean;
    business: boolean;
  };
}

export default function PricingPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">(
    "monthly"
  );

  // Example pricing plans
  const pricingPlans = {
    monthly: [
      {
        name: "Free",
        description: "Basic food analysis for casual users",
        price: "$0",
        features: [
          "Basic food analysis",
          "5 chats per day",
          "Image recognition",
        ],
        cta: "Get Started",
        popular: false,
      },
      {
        name: "Premium",
        description: "Advanced features for food enthusiasts",
        price: "$9.99",
        features: [
          "Unlimited chats",
          "Advanced food analysis",
          "Nutrition tracking",
          "Meal planning",
          "Recipe suggestions",
        ],
        cta: "Subscribe",
        popular: true,
      },
      {
        name: "Business",
        description: "Professional tools for restaurants and food businesses",
        price: "$29.99",
        features: [
          "Everything in Premium",
          "Menu analysis",
          "Customer preference insights",
          "Team collaboration",
          "Priority support",
        ],
        cta: "Contact Sales",
        popular: false,
      },
    ],
    annual: [
      {
        name: "Free",
        description: "Basic food analysis for casual users",
        price: "$0",
        features: [
          "Basic food analysis",
          "5 chats per day",
          "Image recognition",
        ],
        cta: "Get Started",
        popular: false,
      },
      {
        name: "Premium",
        description: "Advanced features for food enthusiasts",
        price: "$7.99",
        features: [
          "Unlimited chats",
          "Advanced food analysis",
          "Nutrition tracking",
          "Meal planning",
          "Recipe suggestions",
        ],
        cta: "Subscribe",
        popular: true,
      },
      {
        name: "Business",
        description: "Professional tools for restaurants and food businesses",
        price: "$24.99",
        features: [
          "Everything in Premium",
          "Menu analysis",
          "Customer preference insights",
          "Team collaboration",
          "Priority support",
        ],
        cta: "Contact Sales",
        popular: false,
      },
    ],
  };

  // Features comparison
  const features: PlanFeature[] = [
    {
      name: "Food analysis",
      included: { free: true, premium: true, business: true },
    },
    {
      name: "Image recognition",
      included: { free: true, premium: true, business: true },
    },
    {
      name: "Chat limit",
      included: { free: false, premium: true, business: true },
    },
    {
      name: "Nutrition tracking",
      included: { free: false, premium: true, business: true },
    },
    {
      name: "Meal planning",
      included: { free: false, premium: true, business: true },
    },
    {
      name: "Recipe suggestions",
      included: { free: false, premium: true, business: true },
    },
    {
      name: "Menu analysis",
      included: { free: false, premium: false, business: true },
    },
    {
      name: "Customer insights",
      included: { free: false, premium: false, business: true },
    },
    {
      name: "Team collaboration",
      included: { free: false, premium: false, business: true },
    },
    {
      name: "Priority support",
      included: { free: false, premium: false, business: true },
    },
  ];

  const handlePlanSelect = (plan: string) => {
    if (plan === "Free") {
      router.push("/chat");
    } else {
      // For premium plans, you would implement subscription logic
      router.push("/auth/signup");
    }
  };

  return (
    <div className="container max-w-6xl mx-auto py-8 px-4 sm:py-16">
      <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold mb-4">Pricing Plans</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto text-base sm:text-lg">
          Choose the perfect plan for your food journey. All plans include core
          features with different levels of access and capabilities.
        </p>
      </div>

      {/* Billing cycle toggle */}
      <div className="flex justify-center mb-8">
        <Tabs
          defaultValue="monthly"
          value={billingCycle}
          onValueChange={(value: string) =>
            setBillingCycle(value as "monthly" | "annual")
          }
          className="w-[300px]">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
            <TabsTrigger value="annual">
              Annual{" "}
              <span className="ml-1 text-xs px-1.5 py-0.5 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full">
                Save 20%
              </span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Pricing cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {pricingPlans[billingCycle].map((plan, index) => (
          <Card
            key={plan.name}
            className={`relative ${
              plan.popular ? "border-primary shadow-lg" : ""
            }`}>
            {plan.popular && (
              <div className="absolute top-0 right-0 -translate-y-1/2 px-3 py-1 bg-primary text-primary-foreground text-sm font-medium rounded-full">
                Most Popular
              </div>
            )}
            <CardHeader>
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <span className="text-4xl font-bold">{plan.price}</span>
                {plan.name !== "Free" && (
                  <span className="text-muted-foreground">
                    /
                    {billingCycle === "monthly"
                      ? "month"
                      : "month, billed annually"}
                  </span>
                )}
              </div>
              <ul className="space-y-2 mb-6">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center">
                    <CheckIcon className="mr-2 h-5 w-5 text-green-500" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                onClick={() => handlePlanSelect(plan.name)}
                className={`w-full ${plan.popular ? "bg-primary" : ""}`}>
                {plan.cta}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Features comparison */}
      <div className="mt-16 mb-16">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center">
          Features Comparison
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left py-4 px-4 sm:px-6 w-1/4">Feature</th>
                <th className="text-center py-4 px-4 sm:px-6 w-1/4">Free</th>
                <th className="text-center py-4 px-4 sm:px-6 w-1/4">Premium</th>
                <th className="text-center py-4 px-4 sm:px-6 w-1/4">
                  Business
                </th>
              </tr>
            </thead>
            <tbody>
              {features.map((feature, i) => (
                <tr
                  key={feature.name}
                  className={i % 2 === 0 ? "bg-muted/50" : ""}>
                  <td className="py-3 px-4 sm:px-6 font-medium">
                    {feature.name}
                  </td>
                  <td className="py-3 px-4 sm:px-6 text-center">
                    {feature.included.free ? (
                      <CheckIcon className="mx-auto h-5 w-5 text-green-500" />
                    ) : (
                      <Cross1Icon className="mx-auto h-5 w-5 text-gray-300" />
                    )}
                  </td>
                  <td className="py-3 px-4 sm:px-6 text-center">
                    {feature.included.premium ? (
                      <CheckIcon className="mx-auto h-5 w-5 text-green-500" />
                    ) : (
                      <Cross1Icon className="mx-auto h-5 w-5 text-gray-300" />
                    )}
                  </td>
                  <td className="py-3 px-4 sm:px-6 text-center">
                    {feature.included.business ? (
                      <CheckIcon className="mx-auto h-5 w-5 text-green-500" />
                    ) : (
                      <Cross1Icon className="mx-auto h-5 w-5 text-gray-300" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* FAQ section */}
      <div className="mt-16 mb-12">
        <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-center">
          Frequently Asked Questions
        </h2>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Can I change plans later?</h3>
            <p className="text-muted-foreground">
              Yes, you can upgrade or downgrade your plan at any time. Changes
              will be applied to your next billing cycle.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-medium">
              How does the Free plan work?
            </h3>
            <p className="text-muted-foreground">
              The Free plan gives you access to basic features with limited
              usage. It's perfect for casual users who want to try our service.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Do you offer refunds?</h3>
            <p className="text-muted-foreground">
              Yes, we offer a 30-day money-back guarantee for all premium
              subscriptions if you're not satisfied with our service.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-medium">
              What payment methods do you accept?
            </h3>
            <p className="text-muted-foreground">
              We accept all major credit cards, PayPal, and Apple Pay for
              subscription payments.
            </p>
          </div>
        </div>
      </div>

      {/* CTA section */}
      <div className="mt-16 text-center bg-muted py-12 px-4 sm:px-8 rounded-lg">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4">
          Ready to get started with Broqui?
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
          Join thousands of food enthusiasts who are already using Broqui to
          enhance their culinary experience.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" onClick={() => router.push("/chat")}>
            Try For Free
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={() => router.push("/auth/signup")}>
            Create Account
          </Button>
        </div>
      </div>
    </div>
  );
}
