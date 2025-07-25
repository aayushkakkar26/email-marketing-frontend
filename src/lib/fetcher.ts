

export const fetcher = async (url: string, token: string) => {
 
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Network response was not ok");
  return res.json();
};