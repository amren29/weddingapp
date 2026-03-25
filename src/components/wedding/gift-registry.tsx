"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Gift, Check, ExternalLink } from "lucide-react";

interface GiftItem {
  id: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  link: string | null;
  price: number | null;
  status: string;
  claimedBy: string | null;
}

interface GiftRegistryProps {
  weddingId: string;
  isAdmin?: boolean;
}

export function GiftRegistry({ weddingId, isAdmin = false }: GiftRegistryProps) {
  const [gifts, setGifts] = useState<GiftItem[]>([]);
  const [claimName, setClaimName] = useState("");

  const fetchGifts = useCallback(async () => {
    const res = await fetch(`/api/gifts/${weddingId}`);
    if (res.ok) setGifts(await res.json());
  }, [weddingId]);

  useEffect(() => {
    fetchGifts();
  }, [fetchGifts]);

  const handleClaim = async (giftId: string) => {
    if (!claimName) {
      toast.error("Please enter your name");
      return;
    }

    const res = await fetch(`/api/gifts/${weddingId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ giftId, claimedBy: claimName }),
    });

    if (!res.ok) {
      toast.error("Failed to claim gift");
      return;
    }

    toast.success("Gift claimed!");
    fetchGifts();
  };

  return (
    <div className="space-y-6">
      {!isAdmin && (
        <div className="max-w-sm">
          <Input
            placeholder="Your name (to claim gifts)"
            value={claimName}
            onChange={(e) => setClaimName(e.target.value)}
          />
        </div>
      )}

      {gifts.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <Gift className="h-16 w-16 mx-auto mb-3 opacity-50" />
          <p>No gifts in the registry yet.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {gifts.map((gift) => (
            <Card key={gift.id} className={gift.status !== "AVAILABLE" ? "opacity-70" : ""}>
              <CardContent className="pt-6">
                {gift.imageUrl && (
                  <img
                    src={gift.imageUrl}
                    alt={gift.name}
                    className="w-full h-40 object-cover rounded-lg mb-3"
                  />
                )}
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold">{gift.name}</h3>
                  <Badge variant={gift.status === "AVAILABLE" ? "default" : "secondary"}>
                    {gift.status === "AVAILABLE" ? "Available" : "Claimed"}
                  </Badge>
                </div>
                {gift.description && (
                  <p className="text-sm text-muted-foreground mb-2">{gift.description}</p>
                )}
                {gift.price && (
                  <p className="font-medium mb-3">${gift.price.toFixed(2)}</p>
                )}
                <div className="flex gap-2">
                  {gift.status === "AVAILABLE" && !isAdmin && (
                    <Button
                      size="sm"
                      className="bg-rose-600 hover:bg-rose-700"
                      onClick={() => handleClaim(gift.id)}
                      disabled={!claimName}
                    >
                      <Check className="h-4 w-4 mr-1" />
                      Claim
                    </Button>
                  )}
                  {gift.link && (
                    <a href={gift.link} target="_blank" rel="noopener noreferrer">
                      <Button size="sm" variant="outline">
                        <ExternalLink className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    </a>
                  )}
                </div>
                {isAdmin && gift.claimedBy && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Claimed by: {gift.claimedBy}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
