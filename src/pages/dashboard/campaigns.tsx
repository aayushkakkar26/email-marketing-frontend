import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Plus,
  Mail,
  Users,
  Clock,
  TrendingUp,
  Calendar,
  Send,
  Trash2,
} from "lucide-react";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAuth, useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import {
  useContacts,
  useSenders,
  useCreateCampaign,
  useCampaigns,
} from "@/hooks/useFetch";
import DashboardNavbar from "@/components/ui/DashboardNavbar";

export default function CampaignsPage() {
  const router = useRouter();
  const { getToken } = useAuth();
  const { isLoaded, isSignedIn } = useUser();

  const [campaignName, setCampaignName] = useState("");
  const [senderEmail, setSenderEmail] = useState("");
  const [steps, setSteps] = useState([{ subject: "", body: "", delay: 0 }]);
  const [recipients, setRecipients] = useState<string[]>([]);

  const createCampaign = useCreateCampaign();
  const {
    data: campaignsData,
    isLoading: loadingCampaigns,
    isError: errorCampaigns,
  } = useCampaigns();
  console.log("campaignsData", campaignsData);
  const {
    data: contacts,
    isLoading: isContactsLoading,
    isError: isContactsError,
  } = useContacts();

  const {
    data: senders,
    isLoading: isSendersLoading,
    isError: isSendersError,
  } = useSenders();

  // 🔐 Block access if not signed in
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/sign-in"); // or show message instead of redirect
    }
  }, [isLoaded, isSignedIn, router]);

  const handleStepChange = (
    index: number,
    field: "subject" | "body" | "delay",
    value: string | number
  ) => {
    const updated = [...steps];
    updated[index][field] = value as never;
    setSteps(updated);
  };

  const addStep = () => {
    setSteps([...steps, { subject: "", body: "", delay: 0 }]);
  };

  const deleteStep = (index: number) => {
    if (steps.length > 1) {
      const newSteps = steps.filter((_, i) => i !== index);
      setSteps(newSteps);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = await getToken();
    if (!token) return toast.error("Missing token");

    createCampaign.mutate(
      {
        token,
        payload: {
          name: campaignName,
          senderEmail,
          recipients,
          steps,
          status: "scheduled",
        },
      },
      {
        onSuccess: () => {
          toast.success("Campaign created!");
          setCampaignName("");
          setSenderEmail("");
          setRecipients([]);
          setSteps([{ subject: "", body: "", delay: 0 }]);
        },
        onError: () => {
          toast.error("Campaign creation failed");
        },
      }
    );
  };

  if (!isLoaded) {
    return <div className="p-6 text-white">Loading user...</div>;
  }

  if (!isSignedIn) {
    return (
      <div className="p-6 text-white">
        You must be signed in to view this page.
      </div>
    );
  }

  if (isContactsError || isSendersError) {
    return (
      <div className="p-6 text-red-500">
        Failed to load data. Please try again later.
      </div>
    );
  }

  if (isContactsLoading || isSendersLoading) {
    return <div className="p-6 text-white">Loading campaign setup...</div>;
  }

  return (
    <>
      <DashboardNavbar />

      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
        <div className="container mx-auto p-4 lg:p-8">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {/* Left: Create Campaign Form */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-xl shadow-lg">
                  <Mail className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-white">
                    Campaign Mangement
                  </h1>
                  <p className="text-slate-400 mt-1">
                    Create your personalized campaigns
                  </p>
                </div>
              </div>

              <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                <CardContent className="p-6">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label
                        htmlFor="campaign-name"
                        className="text-slate-200 font-medium"
                      >
                        Campaign Name
                      </Label>
                      <Input
                        id="campaign-name"
                        className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500/20"
                        placeholder="Enter campaign name"
                        value={campaignName}
                        onChange={(e) => setCampaignName(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="sender-email"
                        className="text-slate-200 font-medium"
                      >
                        Sender Email
                      </Label>
                      <select
                        id="sender-email"
                        value={senderEmail}
                        onChange={(e) => setSenderEmail(e.target.value)}
                        className="w-full p-3 rounded-lg bg-slate-900/50 border border-slate-600 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                      >
                        <option value="">Select Sender Email</option>
                        {senders?.map((s: any) => (
                          <option key={s._id} value={s.email}>
                            {s.email}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-3">
                      <Label className="text-slate-200 font-medium flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Recipients ({recipients.length} selected)
                      </Label>
                      <div className="relative">
                        <select
                          multiple
                          value={recipients}
                          onChange={(e) => {
                            const selectedOptions = Array.from(
                              e.target.selectedOptions,
                              (option) => option.value
                            );
                            setRecipients(selectedOptions);
                          }}
                          className="w-full min-h-[120px] p-3 rounded-lg bg-slate-900/50 border border-slate-600 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                          size={Math.min(contacts?.length || 4, 6)}
                        >
                          {contacts?.map((c: any) => (
                            <option
                              key={c._id}
                              value={c.email}
                              className="p-2 hover:bg-slate-700 cursor-pointer"
                            >
                              {c.firstName} ({c.email})
                            </option>
                          ))}
                        </select>
                        <p className="text-xs text-slate-400 mt-1">
                          Hold Ctrl/Cmd to select multiple recipients
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <Label className="text-slate-200 font-medium flex items-center gap-2">
                        <Send className="h-4 w-4" />
                        Email Steps
                      </Label>
                      {steps.map((step, index) => (
                        <Card
                          key={index}
                          className="bg-slate-900/50 border-slate-600"
                        >
                          <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-lg text-slate-200 flex items-center gap-2">
                                <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-xs text-white font-bold">
                                  {index + 1}
                                </div>
                                Step {index + 1}
                              </CardTitle>
                              {steps.length > 1 && (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => deleteStep(index)}
                                  className="text-red-400 hover:text-red-300 hover:bg-red-900/20 p-2"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <Input
                              className="bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500/20"
                              placeholder="Subject"
                              value={step.subject}
                              onChange={(e) =>
                                handleStepChange(
                                  index,
                                  "subject",
                                  e.target.value
                                )
                              }
                            />
                            <Textarea
                              className="bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500/20 min-h-[100px]"
                              placeholder="Hi {{firstName}},"
                              value={step.body}
                              onChange={(e) =>
                                handleStepChange(index, "body", e.target.value)
                              }
                            />
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-slate-400" />
                              <Input
                                className="bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500/20"
                                type="number"
                                placeholder="Delay (in hours)"
                                value={step.delay}
                                onChange={(e) =>
                                  handleStepChange(
                                    index,
                                    "delay",
                                    Number.parseInt(e.target.value)
                                  )
                                }
                              />
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                      <Button
                        type="button"
                        onClick={addStep}
                        variant="outline"
                        className="w-full border-slate-600 text-slate-200 hover:bg-slate-800 hover:text-white bg-transparent"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Step
                      </Button>
                    </div>

                    <Button
                      type="submit"
                      disabled={createCampaign.isPending}
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium py-3 transition-all duration-200"
                    >
                      {createCampaign.isPending
                        ? "Creating..."
                        : "Create Campaign"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Right: Campaign List */}
            <div className="space-y-6">
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
              <div className="max-h-[63.5rem] overflow-y-auto space-y-4 pr-2 mt-25 custom-scrollbar">
                {loadingCampaigns ? (
                  <Card className="bg-slate-800/50 border-slate-700">
                    <CardContent className="p-6">
                      <p className="text-slate-400 text-center">
                        Loading campaigns...
                      </p>
                    </CardContent>
                  </Card>
                ) : errorCampaigns ? (
                  <Card className="bg-red-900/20 border-red-800">
                    <CardContent className="p-6">
                      <p className="text-red-400 text-center">
                        Failed to load campaigns.
                      </p>
                    </CardContent>
                  </Card>
                ) : campaignsData?.data.length === 0 ? (
                  <Card className="bg-slate-800/50 border-slate-700">
                    <CardContent className="p-6">
                      <p className="text-slate-400 text-center">
                        No campaigns yet.
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  campaignsData?.data
                    .slice()
                    .reverse()
                    .map((campaign: any) => (
                      <Card
                        key={campaign._id.$oid}
                        className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-colors"
                      >
                        <CardHeader className="pb-3">
                          <div className="flex justify-between items-start">
                            <div className="space-y-1">
                              <CardTitle className="text-xl text-white">
                                {campaign.name}
                              </CardTitle>
                              <div className="flex items-center gap-2 text-sm text-slate-400">
                                <Mail className="h-3 w-3" />
                                {campaign.senderEmail}
                              </div>
                            </div>
                            <div className="text-right">
                              <Badge
                                variant={
                                  campaign.status === "sent"
                                    ? "default"
                                    : "secondary"
                                }
                                className={
                                  campaign.status === "sent"
                                    ? "bg-emerald-600 hover:bg-emerald-700"
                                    : "bg-yellow-600 hover:bg-yellow-700"
                                }
                              >
                                {campaign.status}
                              </Badge>
                              <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {new Date(
                                  campaign.createdAt
                                ).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center gap-2 text-sm">
                              <Users className="h-4 w-4 text-slate-400" />
                              <span className="text-slate-300">
                                {campaign.recipients.length} recipients
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <TrendingUp className="h-4 w-4 text-slate-400" />
                              <span className="text-slate-300">
                                {campaign.openRate}% open rate
                              </span>
                            </div>
                          </div>

                          <Separator className="bg-slate-700" />

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-sm text-slate-400">
                              <Send className="h-4 w-4" />
                              {campaign.steps.length} step
                              {campaign.steps.length > 1 ? "s" : ""}
                            </div>
                            <div className="flex gap-2">
                              {campaign.steps.map(
                                (_step: any, stepIndex: number) => (
                                  <div
                                    key={stepIndex}
                                    className="w-2 h-2 bg-blue-600 rounded-full"
                                  />
                                )
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
