"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export default function ProfilePage() {
  // In a real app, this would come from the user session/database
  const [userPlan, setUserPlan] = useState<"free" | "premium">("free");
  const [usageStats, setUsageStats] = useState({
    resumesGenerated: 1,
    coverLettersGenerated: 2,
    resumeLimit: 3,
    coverLetterLimit: 3,
  });

  const handleUpgrade = async () => {
    try {
      // Call Stripe API to create checkout session
      const response = await fetch("/api/stripe/create-checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_PREMIUM,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create checkout session");
      }

      const { url } = await response.json();
      
      // Redirect to Stripe Checkout
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error("Error upgrading plan:", error);
      alert("Failed to process upgrade. Please try again.");
    }
  };

  const handleManageSubscription = async () => {
    try {
      // Call Stripe API to create portal session
      const response = await fetch("/api/stripe/create-portal", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to create portal session");
      }

      const { url } = await response.json();
      
      // Redirect to Stripe Customer Portal
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error("Error accessing portal:", error);
      alert("Failed to access subscription management. Please try again.");
    }
  };

  const resumeUsagePercent = (usageStats.resumesGenerated / usageStats.resumeLimit) * 100;
  const coverLetterUsagePercent = (usageStats.coverLettersGenerated / usageStats.coverLetterLimit) * 100;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/">
            <h1 className="text-2xl font-bold">AI Resume Generator</h1>
          </Link>
          <Link href="/generator">
            <Button variant="outline">Create Document</Button>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-2">My Profile</h2>
          <p className="text-muted-foreground mb-8">
            Manage your subscription and view your usage statistics
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Current Plan Card */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Current Plan</CardTitle>
                  <Badge variant={userPlan === "premium" ? "default" : "secondary"}>
                    {userPlan === "premium" ? "Premium" : "Free"}
                  </Badge>
                </div>
                <CardDescription>
                  {userPlan === "premium" 
                    ? "You have unlimited access to all features"
                    : "Limited to 3 generations per month"
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {userPlan === "free" ? (
                    <>
                      <div>
                        <p className="text-sm font-medium mb-2">
                          Resume Generations: {usageStats.resumesGenerated} / {usageStats.resumeLimit}
                        </p>
                        <Progress value={resumeUsagePercent} />
                      </div>
                      <div>
                        <p className="text-sm font-medium mb-2">
                          Cover Letter Generations: {usageStats.coverLettersGenerated} / {usageStats.coverLetterLimit}
                        </p>
                        <Progress value={coverLetterUsagePercent} />
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-lg font-semibold text-primary">Unlimited Access</p>
                      <p className="text-sm text-muted-foreground">Generate as many documents as you need</p>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                {userPlan === "free" ? (
                  <Button onClick={handleUpgrade} className="w-full">
                    Upgrade to Premium
                  </Button>
                ) : (
                  <Button onClick={handleManageSubscription} variant="outline" className="w-full">
                    Manage Subscription
                  </Button>
                )}
              </CardFooter>
            </Card>

            {/* Plan Comparison Card */}
            <Card>
              <CardHeader>
                <CardTitle>Premium Benefits</CardTitle>
                <CardDescription>Unlock unlimited potential</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    <span>Unlimited resume generations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    <span>Unlimited cover letter generations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    <span>Premium AI model access</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    <span>Advanced customization options</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    <span>Priority customer support</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    <span>Access to new features first</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <div className="w-full">
                  <p className="text-2xl font-bold mb-2">$9.99 <span className="text-sm font-normal text-muted-foreground">/month</span></p>
                  {userPlan === "free" && (
                    <Button onClick={handleUpgrade} className="w-full">
                      Start Premium Trial
                    </Button>
                  )}
                </div>
              </CardFooter>
            </Card>
          </div>

          {/* Account Information */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>Your account details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Email</p>
                  <p className="text-base">user@example.com</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Member Since</p>
                  <p className="text-base">January 2024</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Documents Generated</p>
                  <p className="text-base">
                    {usageStats.resumesGenerated + usageStats.coverLettersGenerated} documents
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
