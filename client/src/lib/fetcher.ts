export async function fetcher<T>(url: string): Promise<T> {
  const token = localStorage.getItem("token");

  const res = await fetch(`http://localhost:5000${url}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || "فشل في تحميل البيانات");
  }

  return res.json();
}
