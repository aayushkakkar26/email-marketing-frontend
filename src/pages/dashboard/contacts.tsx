import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Users,
  Plus,
  Upload,
  Trash2,
  Mail,
  User,
  FileText,
  Loader2,
  AlertCircle,
  UserPlus,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useUser, useAuth } from "@clerk/nextjs";
import { toast } from "sonner";
import {
  useContacts,
  useAddContact,
  useUploadCSV,
  useDeleteContact,
} from "@/hooks/useFetch";
import DashboardNavbar from "@/components/ui/DashboardNavbar";
import { useRouter } from "next/router";

export default function ContactsPage() {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");

  const { isLoaded, isSignedIn } = useUser();
  const { getToken } = useAuth();
  const router = useRouter();

  const {
    data: contacts,
    isLoading: loadingContacts,
    isError: contactsError,
  } = useContacts();

  const { mutateAsync: addContact, isPending } = useAddContact();
  const { mutateAsync: uploadCSV, isPending: isPendingUpload } = useUploadCSV();
  const { mutate: deleteContact, isPending: isPendingDel } = useDeleteContact();

  // 🔐 Redirect if not signed in
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/sign-in");
    }
  }, [isLoaded, isSignedIn, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !firstName) {
      toast.error("All fields required");
      return;
    }

    try {
      const token = await getToken();
      if (!token) throw new Error("No token found");

      await addContact({ email, firstName, token });
      toast.success("Contact Added!");
      setEmail("");
      setFirstName("");
    } catch (err) {
      console.error(err);
      toast.error("Error saving contact");
    }
  };

  const handleCSVUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const token = await getToken();
      if (!token) throw new Error("No token found");

      await uploadCSV({ file, token });
      toast.success("CSV uploaded!");
    } catch (err) {
      console.error(err);
      toast.error("CSV upload error");
    }
  };

  const handleDelete = async (contactId: string) => {
    if (!confirm("Are you sure you want to delete this contact?")) return;

    const token = await getToken();
    if(!token ) return "Token not found";
    deleteContact({ contactId, token });
  };

  // ⏳ Auth loading state
  if (!isLoaded) {
    return <p className="p-6 text-white">Checking authentication...</p>;
  }

  // 🔐 Block if not logged in
  if (!isSignedIn) {
    return (
      <p className="p-6 text-white">You must be signed in to view this page.</p>
    );
  }

  type Contact = {
    _id: string;
    firstName: string;
    email: string;
    // add other fields if needed
  };

  return (
    <>
      <DashboardNavbar />
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
        <div className="container mx-auto p-4 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-xl shadow-lg">
                <Users className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white">
                  Contact Management
                </h1>
                <p className="text-slate-400 mt-1">
                  Manage your email contacts and subscriber lists
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column: Forms */}
              <div className="space-y-6">
                {/* Add Contact Form */}
                <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-2xl text-white flex items-center gap-2">
                      <UserPlus className="h-6 w-6 text-emerald-400" />
                      Add New Contact
                    </CardTitle>
                    <p className="text-slate-400">
                      Add individual contacts to your list
                    </p>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label
                            htmlFor="first-name"
                            className="text-slate-200 font-medium flex items-center gap-2"
                          >
                            <User className="h-4 w-4" />
                            First Name
                          </Label>
                          <Input
                            id="first-name"
                            type="text"
                            placeholder="Enter first name"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-emerald-500 focus:ring-emerald-500/20"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label
                            htmlFor="email"
                            className="text-slate-200 font-medium flex items-center gap-2"
                          >
                            <Mail className="h-4 w-4" />
                            Email Address
                          </Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="Enter email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-emerald-500 focus:ring-emerald-500/20"
                          />
                        </div>
                      </div>

                      <Button
                        type="submit"
                        disabled={isPending || isPendingUpload}
                        className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-medium py-3 transition-all duration-200"
                      >
                        {isPending || isPendingUpload ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Contact
                          </>
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>

                {/* CSV Upload */}
                <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-xl text-white flex items-center gap-2">
                      <Upload className="h-5 w-5 text-blue-400" />
                      Bulk Upload
                    </CardTitle>
                    <p className="text-slate-400">
                      Upload multiple contacts from a CSV file
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label
                          htmlFor="csv-upload"
                          className="text-slate-200 font-medium flex items-center gap-2"
                        >
                          <FileText className="h-4 w-4" />
                          CSV File
                        </Label>
                        <div className="relative">
                          <input
                            id="csv-upload"
                            type="file"
                            accept=".csv"
                            onChange={handleCSVUpload}
                            className="w-full p-3 rounded-lg bg-slate-900/50 border border-slate-600 text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-emerald-600 file:text-white hover:file:bg-emerald-700 file:cursor-pointer cursor-pointer focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none"
                          />
                        </div>
                      </div>
                      <div className="p-3 bg-slate-900/30 rounded-lg border border-slate-700">
                        <p className="text-xs text-slate-400 mb-1">
                          CSV Format:
                        </p>
                        <code className="text-xs text-slate-300 font-mono">
                          firstName,email
                        </code>
                        <br />
                        <code className="text-xs text-slate-300 font-mono">
                          John,john@example.com
                        </code>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column: Contact List */}
              <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                <CardHeader className="sticky top-0 bg-slate-800/80 backdrop-blur-sm z-10 rounded-t-lg">
                  <CardTitle className="text-2xl text-white flex items-center gap-2">
                    <Users className="h-6 w-6 text-emerald-400" />
                    Your Contacts
                    {contacts && (
                      <Badge
                        variant="secondary"
                        className="bg-slate-700 text-slate-200"
                      >
                        {contacts.length}
                      </Badge>
                    )}
                  </CardTitle>
                  <p className="text-slate-400">
                    Manage your existing contacts
                  </p>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="max-h-[600px] overflow-y-auto">
                    {loadingContacts ? (
                      <div className="flex items-center justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
                        <span className="ml-3 text-slate-400">
                          Loading Contacts...
                        </span>
                      </div>
                    ) : contactsError ? (
                      <div className="flex items-center justify-center py-12 text-red-400">
                        <AlertCircle className="h-5 w-5 mr-2" />
                        Failed to load contacts.
                      </div>
                    ) : contacts?.length === 0 ? (
                      <div className="text-center py-12">
                        <Users className="h-16 w-16 text-slate-600 mx-auto mb-4" />
                        <p className="text-slate-400 text-lg">
                          No contacts found.
                        </p>
                        <p className="text-slate-500 mt-2">
                          Add your first contact to get started
                        </p>
                      </div>
                    ) : (
                      <div className="p-6 space-y-3">
                        {contacts
                          ?.slice()
                          .reverse()
                          .map((contact:Contact, idx: number) => (
                            <div key={idx}>
                              <div className="flex items-center justify-between p-4 bg-slate-900/30 rounded-lg border border-slate-700 hover:bg-slate-900/50 transition-colors">
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                  <div className="w-10 h-10 bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-full flex items-center justify-center flex-shrink-0">
                                    <User className="h-5 w-5 text-white" />
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <p className="font-semibold text-white truncate">
                                      {contact.firstName}
                                    </p>
                                    <p className="text-sm text-slate-400 truncate flex items-center gap-1">
                                      <Mail className="h-3 w-3" />
                                      {contact.email}
                                    </p>
                                  </div>
                                </div>

                                <Button
                                  onClick={() => handleDelete(contact._id)}
                                  disabled={isPendingDel}
                                  variant="ghost"
                                  size="sm"
                                  className="text-red-400 hover:text-red-300 hover:bg-red-900/20 p-2 ml-3"
                                >
                                  {isPendingDel ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <Trash2 className="h-4 w-4" />
                                  )}
                                  <span className="sr-only">
                                    Delete contact
                                  </span>
                                </Button>
                              </div>
                              {idx < contacts.length - 1 && (
                                <Separator className="bg-slate-700/50" />
                              )}
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
