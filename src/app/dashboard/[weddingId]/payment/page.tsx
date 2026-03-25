"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PaymentQR } from "@/components/wedding/payment-qr";
import { toast } from "sonner";
import { QrCode } from "lucide-react";

export default function PaymentSetupPage() {
  const params = useParams();
  const weddingId = params.weddingId as string;
  const [wedding, setWedding] = useState<any>(null);
  const [method, setMethod] = useState("upi");
  const [details, setDetails] = useState({
    upiId: "",
    accountName: "",
    bankName: "",
    accountNumber: "",
    ifscCode: "",
  });
  const [saving, setSaving] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    async function fetch() {
      const { data } = await supabase.from("Wedding").select("*").eq("id", weddingId).single();
      setWedding(data);
      if (data?.paymentMethod) setMethod(data.paymentMethod);
      if (data?.paymentDetails) setDetails({ ...details, ...data.paymentDetails });
    }
    fetch();
  }, [weddingId]);

  const handleSave = async () => {
    setSaving(true);
    const { error } = await supabase
      .from("Wedding")
      .update({ paymentMethod: method, paymentDetails: details })
      .eq("id", weddingId);

    if (error) {
      toast.error("Failed to save");
    } else {
      toast.success("Payment details saved!");
      // Refresh wedding data
      const { data } = await supabase.from("Wedding").select("*").eq("id", weddingId).single();
      setWedding(data);
    }
    setSaving(false);
  };

  if (!wedding) {
    return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-600" /></div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Payment QR Setup</h1>

      <div className="grid lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <QrCode className="h-5 w-5 text-rose-500" />
              Payment Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Payment Method</Label>
              <Select value={method} onValueChange={(v) => v && setMethod(v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="upi">UPI / E-Wallet</SelectItem>
                  <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {method === "upi" && (
              <>
                <div>
                  <Label>UPI ID / Wallet Number</Label>
                  <Input value={details.upiId} onChange={(e) => setDetails({ ...details, upiId: e.target.value })} placeholder="example@upi" />
                </div>
                <div>
                  <Label>Account Name</Label>
                  <Input value={details.accountName} onChange={(e) => setDetails({ ...details, accountName: e.target.value })} placeholder="Name on account" />
                </div>
              </>
            )}

            {method === "bank_transfer" && (
              <>
                <div>
                  <Label>Bank Name</Label>
                  <Input value={details.bankName} onChange={(e) => setDetails({ ...details, bankName: e.target.value })} placeholder="Bank name" />
                </div>
                <div>
                  <Label>Account Name</Label>
                  <Input value={details.accountName} onChange={(e) => setDetails({ ...details, accountName: e.target.value })} placeholder="Account holder name" />
                </div>
                <div>
                  <Label>Account Number</Label>
                  <Input value={details.accountNumber} onChange={(e) => setDetails({ ...details, accountNumber: e.target.value })} placeholder="Account number" />
                </div>
                <div>
                  <Label>IFSC / Swift Code</Label>
                  <Input value={details.ifscCode} onChange={(e) => setDetails({ ...details, ifscCode: e.target.value })} placeholder="Code" />
                </div>
              </>
            )}

            <Button onClick={handleSave} className="w-full bg-rose-600 hover:bg-rose-700" disabled={saving}>
              {saving ? "Saving..." : "Save Payment Details"}
            </Button>
          </CardContent>
        </Card>

        <div>
          <h3 className="font-semibold mb-4">Preview</h3>
          {wedding.paymentMethod && wedding.paymentDetails ? (
            <PaymentQR
              paymentDetails={wedding.paymentDetails}
              paymentMethod={wedding.paymentMethod}
              coupleName={`${wedding.groomName} & ${wedding.brideName}`}
            />
          ) : (
            <Card className="text-center py-12">
              <CardContent>
                <QrCode className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-muted-foreground">Save payment details to see QR preview</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
