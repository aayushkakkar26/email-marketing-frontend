import { fetcher } from "@/lib/fetcher";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@clerk/nextjs";
import { toast } from "sonner";
const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export const useContacts = () => {
  const { getToken } = useAuth();
  return useQuery({
    queryKey: ["contacts"],
    queryFn: async () => {
      const token = await getToken();
      const data = await fetcher(`${baseUrl}/contact`, token!);
      return data;
    },
    staleTime: 60 * 1000,
  });
};

const addContact = async ({
  email,
  firstName,
  token,
}: {
  email: string;
  firstName: string;
  token: string;
}) => {
  // const token = await getToken();
  const res = await fetch(`${baseUrl}/contact`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ email, firstName }),
  });

  if (!res.ok) {
    throw new Error("Failed to save contact");
  }

  return res.json();
};

export const useAddContact = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addContact,
    onSuccess: () => {
      // Invalidate the contacts query so it auto-refetches
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
    },
  });
};

const uploadCSV = async ({ file, token }: { file: File; token: string }) => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${baseUrl}/contact/upload`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!res.ok) {
    throw new Error("CSV upload failed");
  }

  return res.json();
};

export const useUploadCSV = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: uploadCSV,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] }); // 🔁 auto-refresh contact list
    },
  });
};

type DeleteArgs = {
  contactId: string;
  token: string;
};

export const useDeleteContact = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ contactId, token }: DeleteArgs) => {
      const res = await fetch(`${baseUrl}/contact/${contactId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Delete failed");
      return contactId;
    },

    onSuccess: (deletedId) => {
      toast.success("Contact deleted");
      queryClient.setQueryData(["contacts"], (old: any) =>
        old?.filter((c: any) => c._id !== deletedId)
      );
    },

    onError: () => {
      toast.error("Failed to delete contact");
    },
  });
};

export const useDomains = () => {
  const { getToken } = useAuth();
  return useQuery({
    queryKey: ["domains"],
    queryFn: async () => {
      const token = await getToken();
      const data = await fetcher(`${baseUrl}/domain`, token!);
      return data; // Return latest 2 domains
    },
    staleTime: 60 * 1005,
  });
};

export const useCampaigns = () => {
  const { getToken } = useAuth();
  return useQuery({
    queryKey: ["campaigns"],
    queryFn: async () => {
      const token = await getToken();
      const data = await fetcher(
        `${baseUrl}/campaign/summary`,
        token!
      );
      const total = data.reduce(
        (sum: number, c: any) => sum + (c.emailsSent || 0),
        0
      );
      return { data, total };
    },
    staleTime: 60 * 1005,
  });
};

export const useSenders = () => {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: ["senders"],
    queryFn: async () => {
      const token = await getToken();
      const data = await fetcher(`${baseUrl}/sender`, token!);
      return data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

type AddDomainInput = {
  name: string;
  token: string;
};

const addDomain = async ({ name, token }: AddDomainInput) => {
  const res = await fetch(`${baseUrl}/domain`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name }),
  });

  if (!res.ok) {
    throw new Error("Error submitting domain");
  }

  return res.json();
};

export const useAddDomain = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addDomain,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["domains"] }); // refetch useDomains()
    },
  });
};

export const useCreateSender = () => {
  return useMutation({
    mutationFn: async ({ email, token }: { email: string; token: string }) => {
      const res = await fetch(`${baseUrl}/sender`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Sender creation failed");
      }

      return res.json();
    },
  });
};

export const useCreateCampaign = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      token,
      payload,
    }: {
      token: string;
      payload: {
        name: string;
        senderEmail: string;
        recipients: string[];
        steps: { subject: string; body: string; delay: number }[];
        status: string;
      };
    }) => {
      const res = await fetch(`${baseUrl}/campaign`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Campaign creation failed");

      return res.json(); // assuming server returns the new campaign
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["campaigns"] }); // optional: refetch campaigns if listing
    },
  });
};

type DeleteSenderArgs = {
  senderId: string;
  token: string;
};

export const useDeleteSender = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ senderId, token }: DeleteSenderArgs) => {
      const res = await fetch(`${baseUrl}/sender/${senderId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to delete sender");

      return senderId;
    },

    onSuccess: (deletedId) => {
      toast.success("Sender deleted successfully");

      queryClient.setQueryData(["senders"], (old: any) =>
        old?.filter((s: any) => s._id !== deletedId)
      );
    },

    onError: (error) => {
      console.error("❌ Delete sender failed", error);
      toast.error("Failed to delete sender");
    },
  });
};


export const useVerifiedDomains = () => {
  const { getToken } = useAuth();
  return useQuery({
    queryKey: ['verifiedDomains'],
    queryFn: async () => {
      const token = await getToken();
      const data = await fetcher(`${baseUrl}/domain/verified-resend`, token!); // update base URL if needed
      
      return data;
    },
  });
};