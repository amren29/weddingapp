"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Calendar, MapPin, Users, ExternalLink } from "lucide-react";
import { format } from "date-fns";

interface WeddingItem {
  id: string;
  slug: string;
  groomName: string;
  brideName: string;
  eventDate: string;
  venue: string;
  status: string;
  _count?: { guests: number };
}

export default function DashboardPage() {
  const [weddings, setWeddings] = useState<WeddingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchWeddings() {
      const { data: { user } } = await supabase.auth.getUser();
      const userId = user?.id || "test-user-001"; // dev fallback

      const { data } = await supabase
        .from("Wedding")
        .select("id, slug, groomName, brideName, eventDate, venue, status")
        .eq("userId", userId)
        .order("createdAt", { ascending: false });

      setWeddings(data || []);
      setLoading(false);
    }
    fetchWeddings();
  }, [supabase]);

  const statusColors: Record<string, string> = {
    DRAFT: "bg-gray-100 text-gray-700",
    PUBLISHED: "bg-green-100 text-green-700",
    EXPIRED: "bg-amber-100 text-amber-700",
    ARCHIVED: "bg-red-100 text-red-700",
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-600" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">My Weddings</h1>
          <p className="text-muted-foreground">Manage your wedding invitations</p>
        </div>
        <Link href="/dashboard/create">
          <Button className="bg-rose-600 hover:bg-rose-700">
            <Plus className="h-4 w-4 mr-2" />
            New Wedding
          </Button>
        </Link>
      </div>

      {weddings.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <h3 className="text-lg font-semibold mb-2">No weddings yet</h3>
            <p className="text-muted-foreground mb-4">Create your first wedding invitation to get started</p>
            <Link href="/dashboard/create">
              <Button className="bg-rose-600 hover:bg-rose-700">
                <Plus className="h-4 w-4 mr-2" />
                Create Wedding
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {weddings.map((wedding) => (
            <Link key={wedding.id} href={`/dashboard/${wedding.id}`}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">
                      {wedding.groomName} & {wedding.brideName}
                    </CardTitle>
                    <Badge className={statusColors[wedding.status] || ""}>
                      {wedding.status}
                    </Badge>
                  </div>
                  <CardDescription className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {format(new Date(wedding.eventDate), "PPP")}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
                    <MapPin className="h-3 w-3" />
                    {wedding.venue}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Users className="h-3 w-3" />
                      {wedding._count?.guests || 0} guests
                    </div>
                    <ExternalLink className="h-4 w-4 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
