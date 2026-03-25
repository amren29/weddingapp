import { redirect } from "next/navigation";

export default async function RsvpDashboardPage({ params }: { params: Promise<{ weddingId: string }> }) {
  const { weddingId } = await params;
  redirect(`/dashboard/${weddingId}/guests`);
}
