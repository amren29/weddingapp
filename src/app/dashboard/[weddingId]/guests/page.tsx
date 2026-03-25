"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Plus, Users, UserCheck, UserX, Clock, Download } from "lucide-react";
import { format } from "date-fns";

interface GuestItem {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  rsvpStatus: string;
  plusOnes: number;
  dietaryNotes: string | null;
  respondedAt: string | null;
  createdAt: string;
}

export default function GuestsPage() {
  const params = useParams();
  const weddingId = params.weddingId as string;
  const [guests, setGuests] = useState<GuestItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [newGuest, setNewGuest] = useState({ name: "", email: "", phone: "" });
  const [dialogOpen, setDialogOpen] = useState(false);
  const supabase = createClient();

  const fetchGuests = async () => {
    const { data } = await supabase
      .from("Guest")
      .select("*")
      .eq("weddingId", weddingId)
      .order("createdAt", { ascending: false });
    setGuests(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchGuests(); }, [weddingId]);

  const handleAddGuest = async () => {
    if (!newGuest.name) {
      toast.error("Name is required");
      return;
    }

    const { error } = await supabase.from("Guest").insert({
      weddingId,
      name: newGuest.name,
      email: newGuest.email || null,
      phone: newGuest.phone || null,
    });

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Guest added!");
    setNewGuest({ name: "", email: "", phone: "" });
    setDialogOpen(false);
    fetchGuests();
  };

  const exportCSV = () => {
    const headers = "Name,Email,Phone,RSVP Status,Plus Ones,Dietary Notes,Responded At\n";
    const rows = guests.map((g) =>
      `"${g.name}","${g.email || ""}","${g.phone || ""}","${g.rsvpStatus}",${g.plusOnes},"${g.dietaryNotes || ""}","${g.respondedAt || ""}"`
    ).join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "guests.csv";
    a.click();
  };

  const statusColors: Record<string, string> = {
    PENDING: "bg-gray-100 text-gray-700",
    ACCEPTED: "bg-green-100 text-green-700",
    DECLINED: "bg-red-100 text-red-700",
    MAYBE: "bg-amber-100 text-amber-700",
  };

  const accepted = guests.filter((g) => g.rsvpStatus === "ACCEPTED");
  const declined = guests.filter((g) => g.rsvpStatus === "DECLINED");
  const pending = guests.filter((g) => g.rsvpStatus === "PENDING");
  const totalHeadcount = accepted.reduce((sum, g) => sum + 1 + g.plusOnes, 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Guests & RSVP</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportCSV}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium h-10 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white cursor-pointer">
              <Plus className="h-4 w-4" />
              Add Guest
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Guest</DialogTitle>
              </DialogHeader>
              <div className="space-y-3 mt-4">
                <div>
                  <Label>Name *</Label>
                  <Input value={newGuest.name} onChange={(e) => setNewGuest({ ...newGuest, name: e.target.value })} />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input type="email" value={newGuest.email} onChange={(e) => setNewGuest({ ...newGuest, email: e.target.value })} />
                </div>
                <div>
                  <Label>Phone</Label>
                  <Input value={newGuest.phone} onChange={(e) => setNewGuest({ ...newGuest, phone: e.target.value })} />
                </div>
                <Button onClick={handleAddGuest} className="w-full bg-rose-600 hover:bg-rose-700">Add Guest</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-4 flex items-center gap-3">
            <Users className="h-8 w-8 text-blue-500" />
            <div>
              <p className="text-2xl font-bold">{guests.length}</p>
              <p className="text-xs text-muted-foreground">Total Guests</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 flex items-center gap-3">
            <UserCheck className="h-8 w-8 text-green-500" />
            <div>
              <p className="text-2xl font-bold">{accepted.length}</p>
              <p className="text-xs text-muted-foreground">Accepted ({totalHeadcount} heads)</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 flex items-center gap-3">
            <UserX className="h-8 w-8 text-red-500" />
            <div>
              <p className="text-2xl font-bold">{declined.length}</p>
              <p className="text-xs text-muted-foreground">Declined</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 flex items-center gap-3">
            <Clock className="h-8 w-8 text-amber-500" />
            <div>
              <p className="text-2xl font-bold">{pending.length}</p>
              <p className="text-xs text-muted-foreground">Pending</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Guest Table */}
      <Card>
        <CardContent className="pt-6">
          {guests.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No guests yet. Add guests or share your invitation link.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>RSVP</TableHead>
                  <TableHead>Plus Ones</TableHead>
                  <TableHead>Responded</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {guests.map((guest) => (
                  <TableRow key={guest.id}>
                    <TableCell className="font-medium">{guest.name}</TableCell>
                    <TableCell>{guest.email || "—"}</TableCell>
                    <TableCell>{guest.phone || "—"}</TableCell>
                    <TableCell>
                      <Badge className={statusColors[guest.rsvpStatus] || ""}>{guest.rsvpStatus}</Badge>
                    </TableCell>
                    <TableCell>{guest.plusOnes}</TableCell>
                    <TableCell>
                      {guest.respondedAt ? format(new Date(guest.respondedAt), "MMM d, yyyy") : "—"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
