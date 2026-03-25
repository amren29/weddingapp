"use client";

import { useParams } from "next/navigation";
import { MessageBoard } from "@/components/wedding/message-board";

export default function DashboardMessagesPage() {
  const params = useParams();
  const weddingId = params.weddingId as string;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Messages</h1>
      <MessageBoard weddingId={weddingId} isAdmin />
    </div>
  );
}
