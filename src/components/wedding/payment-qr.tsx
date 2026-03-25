"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { QrCode } from "lucide-react";
import { generatePaymentQR } from "@/lib/qr/generate-qr";
import { PaymentDetails } from "@/types";

interface PaymentQRProps {
  paymentDetails: PaymentDetails;
  paymentMethod: string;
  coupleName: string;
}

export function PaymentQR({ paymentDetails, paymentMethod, coupleName }: PaymentQRProps) {
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);

  useEffect(() => {
    generatePaymentQR(paymentDetails, paymentMethod).then(setQrDataUrl);
  }, [paymentDetails, paymentMethod]);

  return (
    <Card className="max-w-sm mx-auto text-center">
      <CardHeader>
        <QrCode className="h-8 w-8 text-rose-500 mx-auto mb-2" />
        <CardTitle>Send a Gift</CardTitle>
        <p className="text-sm text-muted-foreground">
          Scan to send a monetary gift to {coupleName}
        </p>
      </CardHeader>
      <CardContent>
        {qrDataUrl ? (
          <img src={qrDataUrl} alt="Payment QR Code" className="mx-auto rounded-lg" />
        ) : (
          <div className="h-[300px] flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-600" />
          </div>
        )}
        {paymentMethod === "upi" && paymentDetails.upiId && (
          <p className="mt-4 text-sm font-mono bg-gray-100 rounded p-2">
            {paymentDetails.upiId}
          </p>
        )}
        {paymentMethod === "bank_transfer" && (
          <div className="mt-4 text-sm text-left space-y-1 bg-gray-100 rounded p-3">
            {paymentDetails.bankName && <p><span className="text-muted-foreground">Bank:</span> {paymentDetails.bankName}</p>}
            {paymentDetails.accountName && <p><span className="text-muted-foreground">Name:</span> {paymentDetails.accountName}</p>}
            {paymentDetails.accountNumber && <p><span className="text-muted-foreground">Account:</span> {paymentDetails.accountNumber}</p>}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
