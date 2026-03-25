"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Loader2, Heart } from "lucide-react";
import { toast } from "sonner";

export default function PublishPage() {
  const router = useRouter();
  const supabase = createClient();
  const [status, setStatus] = useState("Restoring your invitation...");

  useEffect(() => {
    async function publish() {
      // Check auth
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login?redirect=/create/publish");
        return;
      }

      // Restore saved wedding data
      const saved = sessionStorage.getItem("pendingWedding");
      if (!saved) {
        toast.error("No saved invitation found. Please create one.");
        router.push("/create");
        return;
      }

      const { form, theme } = JSON.parse(saved);
      setStatus("Publishing your invitation...");

      // Ensure user exists in User table
      const { data: existingUser } = await supabase
        .from("User")
        .select("id")
        .eq("id", user.id)
        .single();

      if (!existingUser) {
        await supabase.from("User").insert({
          id: user.id,
          email: user.email!,
          name: user.user_metadata?.name || user.email!.split("@")[0],
        });
      }

      // Create the wedding
      const slug = `${form.groomName}-and-${form.brideName}-${Date.now().toString(36)}`
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-");

      const { data, error } = await supabase
        .from("Wedding")
        .insert({
          slug,
          userId: user.id,
          groomName: form.groomName,
          brideName: form.brideName,
          groomFamily: form.groomFamily || null,
          brideFamily: form.brideFamily || null,
          eventDate: new Date(form.eventDate).toISOString(),
          venue: form.venue,
          venueAddress: form.venueAddress || null,
          customMessage: form.customMessage || null,
          themeId: theme.id,
          themeConfig: theme,
          status: "PUBLISHED",
        })
        .select("id")
        .single();

      if (error) {
        toast.error("Failed to publish: " + error.message);
        router.push("/create");
        return;
      }

      // Clear saved data
      sessionStorage.removeItem("pendingWedding");
      toast.success("Invitation published!");
      router.push(`/dashboard/${data.id}`);
    }

    publish();
  }, [router, supabase]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-6">
          <Heart className="h-7 w-7 text-gray-400" />
        </div>
        <Loader2 className="h-5 w-5 animate-spin text-gray-400 mx-auto mb-4" />
        <p className="text-sm text-gray-500">{status}</p>
      </div>
    </div>
  );
}
