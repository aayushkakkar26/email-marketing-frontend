import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Send, Plus, Trash2, Mail, Globe, CheckCircle, Clock, AlertCircle } from "lucide-react"

import { useState, useEffect } from "react";
import { useUser, useAuth } from "@clerk/nextjs";
import { toast } from "sonner";
import DashboardNavbar from "@/components/ui/DashboardNavbar";
import {
  useSenders,
  useCreateSender,
  useDeleteSender,
  useVerifiedDomains,
} from "@/hooks/useFetch";
import { useRouter } from "next/router";


export default function SenderPage() {
  const { isLoaded, isSignedIn } = useUser();
  const { getToken } = useAuth();
  const [email, setEmail] = useState("");
  const [selectedDomain, setSelectedDomain] = useState("");
  const router = useRouter();

  const {
    data: senders,
    isLoading: isSendersLoading,
    isError: isSendersError,
    error: sendersError,
    refetch: refetchSenders,
  } = useSenders();

  const createSender = useCreateSender();
  const { mutate: deleteSender } = useDeleteSender();
  const { data: verifiedDomain, isLoading, isError } = useVerifiedDomains();
  const domainsArray = verifiedDomain
  ? Array.isArray(verifiedDomain)
    ? verifiedDomain
    : [verifiedDomain]
  : [];

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!selectedDomain) {
    toast.error("Please select a verified domain.");
    return;
  }

  const fullEmail = `${email}@${selectedDomain}`;

  try {
    const token = await getToken();
    if (!token) throw new Error("No token found");

    await createSender.mutateAsync(
      { email: fullEmail, token },
      {
        onSuccess: () => {
          toast.success("Sender added!");
          setEmail("");
          setSelectedDomain("");
          refetchSenders(); // Refresh sender list after success
        },
        onError: (err: any) => {
          console.error("❌ Error adding sender:", err);
          toast.error(err?.response?.data?.message || err.message || "Failed to add sender");
        },
      }
    );
  } catch (err) {
    console.error("❌ Token error:", err);
    toast.error("Token error. Please re-authenticate.");
  }
};

  const handleDelete = async (senderId: string) => {
    const confirmDelete = confirm(
      "Are you sure you want to delete this sender?"
    );
    if (!confirmDelete) return;

    const token = await getToken();
    deleteSender({ senderId, token });
  };
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/sign-in");
    }
  }, [isLoaded, isSignedIn, router]);

  if (!isLoaded) return <div className="p-6">Loading user...</div>;
  if (!isSignedIn)
    return (
      <div className="p-6 text-red-500">
        Please sign in to access this page.
      </div>
    );

    const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-4 w-4" />
      case "pending":
        return <Clock className="h-4 w-4" />
      default:
        return <AlertCircle className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-emerald-600 hover:bg-emerald-700"
      case "pending":
        return "bg-yellow-600 hover:bg-yellow-700"
      default:
        return "bg-red-600 hover:bg-red-700"
    }
  }

  return (
    <>
      <DashboardNavbar />
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
      <div className="container mx-auto p-4 lg:p-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-lg">
              <Send className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white">Sender Management</h1>
              <p className="text-slate-400 mt-1">Manage your email sender addresses and domains</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Add Sender Form */}
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl text-white flex items-center gap-2">
                  <Plus className="h-6 w-6 text-blue-400" />
                  Add New Sender
                </CardTitle>
                <p className="text-slate-400">Create a new sender email address</p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="sender-name" className="text-slate-200 font-medium flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        Sender Name
                      </Label>
                      <Input
                        id="sender-name"
                        type="text"
                        placeholder="Enter sender name (before @)"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500/20"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="domain-select" className="text-slate-200 font-medium flex items-center gap-2">
                        <Globe className="h-4 w-4" />
                        Domain
                      </Label>
                      <select
                        id="domain-select"
                        value={selectedDomain}
                        onChange={(e) => setSelectedDomain(e.target.value)}
                        className="w-full p-3 rounded-lg bg-slate-900/50 border border-slate-600 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                        required
                      >
                        <option value="">Select domain</option>
                        {domainsArray.length > 0 ? (
                          domainsArray.map((d: any) => (
                            <option key={d.id} value={d.name}>
                              {d.name}
                            </option>
                          ))
                        ) : (
                          <option disabled>No verified domain</option>
                        )}
                      </select>
                    </div>

                    {email && selectedDomain && (
                      <div className="p-4 bg-slate-900/30 rounded-lg border border-slate-700">
                        <p className="text-sm text-slate-400 mb-1">Preview:</p>
                        <p className="text-white font-medium">
                          {email}@{selectedDomain}
                        </p>
                      </div>
                    )}
                  </div>

                  <Button
                    type="submit"
                    disabled={createSender.isPending}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium py-3 transition-all duration-200"
                  >
                    {createSender.isPending ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Adding...
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Sender
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Senders List */}
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl text-white flex items-center gap-2">
                  <Mail className="h-6 w-6 text-emerald-400" />
                  Your Senders
                  {senders && (
                    <Badge variant="secondary" className="bg-slate-700 text-slate-200">
                      {senders.length}
                    </Badge>
                  )}
                </CardTitle>
                <p className="text-slate-400">Manage your existing sender addresses</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {isSendersLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                      <span className="ml-3 text-slate-400">Loading senders...</span>
                    </div>
                  ) : isSendersError ? (
                    <div className="flex items-center justify-center py-8 text-red-400">
                      <AlertCircle className="h-5 w-5 mr-2" />
                      Error: {sendersError?.message}
                    </div>
                  ) : senders?.length === 0 ? (
                    <div className="text-center py-8">
                      <Send className="h-12 w-12 text-slate-600 mx-auto mb-3" />
                      <p className="text-slate-400">No senders found.</p>
                      <p className="text-sm text-slate-500 mt-1">Add your first sender to get started</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {senders?.map((sender: any, index: number) => (
                        <div key={sender._id}>
                          <div className="flex items-center justify-between p-4 bg-slate-900/30 rounded-lg border border-slate-700 hover:bg-slate-900/50 transition-colors">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-3 mb-2">
                                <Mail className="h-4 w-4 text-slate-400 flex-shrink-0" />
                                <p className="text-white font-medium truncate">{sender.email}</p>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-slate-400">
                                <Globe className="h-3 w-3" />
                                <span>Domain: {sender.domain}</span>
                              </div>
                            </div>

                            <div className="flex items-center gap-3 ml-4">
                              <Badge className={`${getStatusColor(sender.status)} text-white flex items-center gap-1`}>
                                {getStatusIcon(sender.status)}
                                <span className="capitalize">{sender.status}</span>
                              </Badge>

                              <Button
                                onClick={() => handleDelete(sender._id)}
                                variant="ghost"
                                size="sm"
                                className="text-red-400 hover:text-red-300 hover:bg-red-900/20 p-2"
                              >
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Delete sender</span>
                              </Button>
                            </div>
                          </div>
                          {index < senders.length - 1 && <Separator className="bg-slate-700/50" />}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
