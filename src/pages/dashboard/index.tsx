import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import DashboardNavbar from "@/components/ui/DashboardNavbar";
import { Mail, Users, Send, BarChart3 } from "lucide-react";

import { useDomains, useCampaigns, useContacts } from "@/hooks/useFetch";
import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";
import { useRouter } from "next/router";

export default function DashboardPage() {
  const router = useRouter();
  const { isLoaded, isSignedIn } = useUser();

  const {
    data: recentDomains,
    isLoading: loadingDomains,
    isError: errorDomains,
  } = useDomains();
  const {
    data: campaignsData,
    isLoading: loadingCampaigns,
    isError: errorCampaigns,
  } = useCampaigns();
  const {
    data: contacts,
    isLoading: loadingContacts,
    isError: errorContacts,
  } = useContacts();

  const totalEmailsSent = campaignsData?.total || 0;
  const campaigns = campaignsData?.data || [];

  // 🔐 Redirect if not signed in
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/sign-in");
    }
  }, [isLoaded, isSignedIn, router]);

  if (!isLoaded) {
    return <p className="p-6 text-white">Checking authentication...</p>;
  }

  if (!isSignedIn) {
    return (
      <p className="p-6 text-white">You must be signed in to view this page.</p>
    );
  }

  if (loadingDomains || loadingCampaigns || loadingContacts) {
    return <p className="p-6 text-white">Loading dashboard...</p>;
  }

  if (errorDomains || errorCampaigns || errorContacts) {
    return (
      <p className="p-6 text-red-500">
        Something went wrong while loading data. Please try again later.
      </p>
    );
  }
  const getStatusColor = (status: string) => {
    switch (status) {
      case "sent":
        return "text-emerald-400";
      case "scheduled":
        return "text-amber-400";
      case "verified":
        return "text-emerald-400";
      case "pending":
        return "text-amber-400";
      default:
        return "text-gray-400";
    }
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = "text-xs font-medium px-3 py-1 rounded-full border";
    switch (status) {
      case "sent":
        return `${baseClasses} bg-emerald-500/10 text-emerald-400 border-emerald-500/20`;
      case "scheduled":
        return `${baseClasses} bg-amber-500/10 text-amber-400 border-amber-500/20`;
      case "verified":
        return `${baseClasses} bg-emerald-500/10 text-emerald-400 border-emerald-500/20`;
      case "pending":
        return `${baseClasses} bg-amber-500/10 text-amber-400 border-amber-500/20`;
      default:
        return `${baseClasses} bg-gray-500/10 text-gray-400 border-gray-500/20`;
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#020416" }}>
      <DashboardNavbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header Section */}
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-lg">
            <BarChart3 className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-white">Dashboard</h1>
            <p className="text-slate-400 mt-1">
             View Your Metrices 
            </p>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card
            className="border-[#1a2332] hover:shadow-xl transition-all duration-300 hover:shadow-[#0A1429]/20 hover:border-[#2a3441]"
            style={{ backgroundColor: "#0A1429" }}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-gray-300">
                Total Campaigns
              </CardTitle>
              <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
                <Mail className="h-4 w-4 text-blue-400" />
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-3xl font-bold text-white">
                {campaigns.length}
              </div>
              <p className="text-sm text-emerald-400 font-medium">
                +2 from last month
              </p>
            </CardContent>
          </Card>

          <Card
            className="border-[#1a2332] hover:shadow-xl transition-all duration-300 hover:shadow-[#0A1429]/20 hover:border-[#2a3441]"
            style={{ backgroundColor: "#0A1429" }}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-gray-300">
                Total Contacts
              </CardTitle>
              <div className="p-2 bg-purple-500/10 rounded-lg border border-purple-500/20">
                <Users className="h-4 w-4 text-purple-400" />
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-3xl font-bold text-white">
                {contacts.length.toLocaleString()}
              </div>
              <p className="text-sm text-emerald-400 font-medium">
                +180 from last month
              </p>
            </CardContent>
          </Card>

          <Card
            className="border-[#1a2332] hover:shadow-xl transition-all duration-300 hover:shadow-[#0A1429]/20 hover:border-[#2a3441]"
            style={{ backgroundColor: "#0A1429" }}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-gray-300">
                Emails Sent
              </CardTitle>
              <div className="p-2 bg-green-500/10 rounded-lg border border-green-500/20">
                <Send className="h-4 w-4 text-green-400" />
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-3xl font-bold text-white">
                {totalEmailsSent.toLocaleString()}
              </div>
              <p className="text-sm text-emerald-400 font-medium">
                +12% from last month
              </p>
            </CardContent>
          </Card>

          <Card
            className="border-[#1a2332] hover:shadow-xl transition-all duration-300 hover:shadow-[#0A1429]/20 hover:border-[#2a3441]"
            style={{ backgroundColor: "#0A1429" }}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-gray-300">
                Open Rate
              </CardTitle>
              <div className="p-2 bg-orange-500/10 rounded-lg border border-orange-500/20">
                <BarChart3 className="h-4 w-4 text-orange-400" />
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-3xl font-bold text-white">24.5%</div>
              <p className="text-sm text-emerald-400 font-medium">
                +2.1% from last month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Recent Campaigns */}
          <Card
            className="border-[#1a2332]"
            style={{ backgroundColor: "#0A1429" }}
          >
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-semibold text-white">
                Recent Campaigns
              </CardTitle>
              <CardDescription className="text-gray-300">
                Your latest email campaigns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-80 overflow-y-auto">
                <style jsx>{`
                  .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                  }
                  .custom-scrollbar::-webkit-scrollbar-track {
                    background: #1a2332;
                    border-radius: 3px;
                  }
                  .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #2a3441;
                    border-radius: 3px;
                  }
                  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #3a4451;
                  }
                `}</style>
                <div className="space-y-4 max-h-80 overflow-y-auto custom-scrollbar">
                  {campaigns.slice().reverse().map((c) => (
                    <div
                      key={c._id}
                      className="flex items-start justify-between p-4 rounded-lg border border-[#1a2332] hover:border-[#2a3441] transition-all duration-200 hover:shadow-lg"
                      style={{ backgroundColor: "#020416" }}
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-white truncate">
                          {c.name}
                        </p>
                        <p className="text-sm text-gray-300 mt-1">
                          {`${
                            c.steps.length
                          } steps • ${c.recipients.length.toLocaleString()} recipients`}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          Created: {new Date(c.createdAt).toLocaleDateString()}{" "}
                          at{" "}
                          {new Date(c.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                      <div className="flex flex-col items-end space-y-2 ml-4">
                        <span className={getStatusBadge(c.status)}>
                          {c.status}
                        </span>
                        <p className="text-sm font-medium text-gray-300">{`${c.openRate}% open rate`}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Domain Status */}
          <Card
            className="border-[#1a2332]"
            style={{ backgroundColor: "#0A1429" }}
          >
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-semibold text-white">
                Domain Status
              </CardTitle>
              <CardDescription className="text-gray-300">
                Verification status of your sending domains
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentDomains.map((d: any) => (
                  <div
                    key={d._id}
                    className="flex items-center justify-between p-4 rounded-lg border border-[#1a2332] hover:border-[#2a3441] transition-all duration-200 hover:shadow-lg"
                    style={{ backgroundColor: "#020416" }}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-white truncate">
                        {d.name}
                      </p>
                    </div>
                    <div className="flex items-center space-x-3 ml-4">
                      <span className="text-sm text-gray-300">Status:</span>
                      <span className={getStatusBadge(d.status)}>
                        {d.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
