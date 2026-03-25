"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Crown } from "lucide-react";
import Link from "next/link";

interface PremiumGateProps {
  children: React.ReactNode;
  isPremium: boolean;
  featureName: string;
}

export function PremiumGate({ children, isPremium, featureName }: PremiumGateProps) {
  if (isPremium) return <>{children}</>;

  return (
    <Card className="text-center py-12">
      <CardContent>
        <Crown className="h-12 w-12 text-amber-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">Premium Feature</h3>
        <p className="text-muted-foreground mb-6">
          {featureName} is available with the Premium plan.
        </p>
        <Link href="/dashboard/upgrade">
          <Button className="bg-rose-600 hover:bg-rose-700">
            Upgrade to Premium
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
