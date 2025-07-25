// pages/dashboard/domains.tsx
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Globe,
  Plus,
  CheckCircle,
  Clock,
  AlertCircle,
  Copy,
  ExternalLink,
  Shield,
  Database,
  Loader2,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { toast } from "sonner";
import { useDomains, useAddDomain, useVerifiedDomains } from "@/hooks/useFetch";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/router";
import DashboardNavbar from "@/components/ui/DashboardNavbar";

export default function DomainsPage() {
  const [domainValue, setDomainValue] = useState("");
  const { isLoaded, isSignedIn } = useUser();
  const { data: allDomains, isLoading: loadingDomains } = useDomains();
  const { mutateAsync: submitDomain, isPending } = useAddDomain();
  const { data: verifiedDomain, isLoading, isError } = useVerifiedDomains();
  const { getToken } = useAuth();
  const router = useRouter();

  const verifiedDomainsArray = verifiedDomain
    ? Array.isArray(verifiedDomain)
      ? verifiedDomain
      : [verifiedDomain]
    : [];

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/sign-in");
    }
  }, [isLoaded, isSignedIn, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!domainValue.trim()) {
      toast.error("Please enter a domain");
      return;
    }

    try {
      const token = await getToken();
      if (!token) throw new Error("No token found");
      await submitDomain({ name: domainValue.trim(), token });

      toast.success("Domain submitted!");
      setDomainValue("");
    } catch (err) {
      console.error(err);
      toast.error("Error submitting domain");
    }
  };
  if (!isLoaded || !isSignedIn) return <p>Log in to contniue</p>;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "verified":
        return <CheckCircle className="h-4 w-4" />;
      case "pending":
        return <Clock className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "verified":
        return "bg-emerald-600 hover:bg-emerald-700 text-white";
      case "pending":
        return "bg-yellow-600 hover:bg-yellow-700 text-white";
      default:
        return "bg-red-600 hover:bg-red-700 text-white";
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };
  return (
    <>
      <DashboardNavbar />
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
      <div className="container mx-auto p-4 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl shadow-lg">
              <Globe className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white">Domain Verification</h1>
              <p className="text-slate-400 mt-1">Verify your domains to start sending emails</p>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Add Domain Form */}
            <div className="xl:col-span-2">
              <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-2xl text-white flex items-center gap-2">
                    <Plus className="h-6 w-6 text-purple-400" />
                    Add New Domain
                  </CardTitle>
                  <p className="text-slate-400">Enter your domain to start the verification process</p>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="domain-input" className="text-slate-200 font-medium flex items-center gap-2">
                        <Globe className="h-4 w-4" />
                        Domain Name
                      </Label>
                      <div className="flex gap-3">
                        <Input
                          id="domain-input"
                          type="text"
                          placeholder="Enter your domain (e.g. example.com)"
                          value={domainValue}
                          onChange={(e) => setDomainValue(e.target.value)}
                          className="flex-1 bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-purple-500 focus:ring-purple-500/20"
                          required
                        />
                        <Button
                          type="submit"
                          disabled={isPending}
                          className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-medium px-6 transition-all duration-200"
                        >
                          {isPending ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Submitting...
                            </>
                          ) : (
                            <>
                              <Shield className="h-4 w-4 mr-2" />
                              Verify Domain
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Verified Domains Sidebar */}
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl text-white flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-emerald-400" />
                  Verified Domains
                  {verifiedDomain && (
                    <Badge variant="secondary" className="bg-slate-700 text-slate-200">
                      {verifiedDomain.length}
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="max-h-80 overflow-y-auto space-y-3">
                  {isLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin text-purple-500" />
                      <span className="ml-3 text-slate-400">Loading...</span>
                    </div>
                  ) : isError ? (
                    <div className="flex items-center justify-center py-8 text-red-400">
                      <AlertCircle className="h-5 w-5 mr-2" />
                      Failed to fetch domains
                    </div>
                  ) : verifiedDomain?.length === 0 ? (
                    <div className="text-center py-8">
                      <Globe className="h-12 w-12 text-slate-600 mx-auto mb-3" />
                      <p className="text-slate-400">No domains verified yet.</p>
                      <p className="text-sm text-slate-500 mt-1">Add your first domain to get started</p>
                    </div>
                  ) : (
                    verifiedDomainsArray.map((domain) => (
                      <div
                        key={domain.id}
                        className="p-3 bg-slate-900/30 rounded-lg border border-slate-700 hover:bg-slate-900/50 transition-colors"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-semibold text-white truncate">{domain.name}</p>
                          <Badge className={`${getStatusColor(domain.status)} flex items-center gap-1 text-xs`}>
                            {getStatusIcon(domain.status)}
                            <span className="capitalize">{domain.status}</span>
                          </Badge>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Domain Details */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <Database className="h-6 w-6 text-slate-400" />
              <h2 className="text-2xl font-bold text-white">Your Domains</h2>
            </div>

            {allDomains?.length === 0 ? (
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-8">
                  <div className="text-center">
                    <Globe className="h-16 w-16 text-slate-600 mx-auto mb-4" />
                    <p className="text-slate-400 text-lg">No domains added yet.</p>
                    <p className="text-slate-500 mt-2">
                      Add your first domain above to get started with email verification
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {allDomains?.filter((d: any) => d.status !== "verified").map((d: any) => (
                  <Card key={d._id} className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Globe className="h-6 w-6 text-purple-400" />
                          <div>
                            <CardTitle className="text-xl text-white">{d.name}</CardTitle>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-slate-400">Status:</span>
                              <Badge className={`${getStatusColor(d.status)} flex items-center gap-1`}>
                                {getStatusIcon(d.status)}
                                <span className="capitalize">{d.status}</span>
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-slate-600 text-slate-200 hover:bg-slate-800 hover:text-white bg-transparent"
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                            <Database className="h-5 w-5 text-slate-400" />
                            DNS Records
                          </h4>
                          <div className="overflow-x-auto">
                            <div className="min-w-full">
                              <div className="bg-slate-900/50 rounded-lg border border-slate-700">
                                <div className="grid grid-cols-4 gap-4 p-4 bg-slate-800/50 rounded-t-lg border-b border-slate-700">
                                  <div className="font-semibold text-slate-200">Type</div>
                                  <div className="font-semibold text-slate-200">Name</div>
                                  <div className="font-semibold text-slate-200">Value</div>
                                  <div className="font-semibold text-slate-200">TTL</div>
                                </div>
                                {d.records.map((r: any, idx: number) => (
                                  <div key={idx}>
                                    <div className="grid grid-cols-4 gap-4 p-4 hover:bg-slate-800/30 transition-colors">
                                      <div className="text-slate-300">
                                        <Badge variant="outline" className="border-slate-600 text-slate-300">
                                          {r.type}
                                        </Badge>
                                      </div>
                                      <div className="text-slate-300 font-mono text-sm break-all">{r.name}</div>
                                      <div className="text-slate-300 font-mono text-sm break-all group">
                                        <div className="flex items-center gap-2">
                                          <span className="truncate">{r.value}</span>
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => copyToClipboard(r.value)}
                                            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 h-auto"
                                          >
                                            <Copy className="h-3 w-3" />
                                          </Button>
                                        </div>
                                      </div>
                                      <div className="text-slate-300 font-mono text-sm">{r.ttl}</div>
                                    </div>
                                    {idx < d.records.length - 1 && <Separator className="bg-slate-700/50" />}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
