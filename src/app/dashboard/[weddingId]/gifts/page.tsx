"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { GiftRegistry } from "@/components/wedding/gift-registry";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Plus } from "lucide-react";

export default function DashboardGiftsPage() {
  const params = useParams();
  const weddingId = params.weddingId as string;
  const [dialogOpen, setDialogOpen] = useState(false);
  const [gift, setGift] = useState({ name: "", description: "", link: "", price: "" });
  const [key, setKey] = useState(0);

  const handleAddGift = async () => {
    if (!gift.name) {
      toast.error("Gift name is required");
      return;
    }

    const res = await fetch(`/api/gifts/${weddingId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: gift.name,
        description: gift.description || null,
        link: gift.link || null,
        price: gift.price ? parseFloat(gift.price) : null,
      }),
    });

    if (!res.ok) {
      toast.error("Failed to add gift");
      return;
    }

    toast.success("Gift added!");
    setGift({ name: "", description: "", link: "", price: "" });
    setDialogOpen(false);
    setKey((k) => k + 1);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Gift Registry</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium h-10 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white cursor-pointer">
            <Plus className="h-4 w-4" />
            Add Gift
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Gift</DialogTitle>
            </DialogHeader>
            <div className="space-y-3 mt-4">
              <div>
                <Label>Gift Name *</Label>
                <Input value={gift.name} onChange={(e) => setGift({ ...gift, name: e.target.value })} placeholder="e.g., Kitchen Mixer" />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea value={gift.description} onChange={(e) => setGift({ ...gift, description: e.target.value })} placeholder="Optional description" rows={2} />
              </div>
              <div>
                <Label>Link (optional)</Label>
                <Input value={gift.link} onChange={(e) => setGift({ ...gift, link: e.target.value })} placeholder="https://..." />
              </div>
              <div>
                <Label>Price (optional)</Label>
                <Input type="number" value={gift.price} onChange={(e) => setGift({ ...gift, price: e.target.value })} placeholder="0.00" />
              </div>
              <Button onClick={handleAddGift} className="w-full bg-rose-600 hover:bg-rose-700">Add Gift</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <GiftRegistry key={key} weddingId={weddingId} isAdmin />
    </div>
  );
}
