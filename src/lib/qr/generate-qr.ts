import QRCode from "qrcode";
import { PaymentDetails } from "@/types";

export async function generatePaymentQR(
  paymentDetails: PaymentDetails,
  method: string
): Promise<string> {
  let data: string;

  if (method === "upi" && paymentDetails.upiId) {
    data = `upi://pay?pa=${encodeURIComponent(paymentDetails.upiId)}&pn=${encodeURIComponent(paymentDetails.accountName || "")}&cu=MYR`;
  } else {
    const parts = [
      paymentDetails.bankName,
      paymentDetails.accountName,
      paymentDetails.accountNumber,
      paymentDetails.ifscCode,
    ].filter(Boolean);
    data = parts.join(" | ");
  }

  return QRCode.toDataURL(data, {
    width: 300,
    margin: 2,
    color: {
      dark: "#000000",
      light: "#FFFFFF",
    },
  });
}
