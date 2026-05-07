const API_URL =
  import.meta.env.VITE_API_URL;

export async function apiFetch(
  endpoint: string,
  options: RequestInit = {}
) {
  const token =
    localStorage.getItem(
      "token"
    );

  const res = await fetch(
    `${API_URL}${endpoint}`,
    {
      ...options,

      headers: {
        "Content-Type":
          "application/json",

        Authorization: token
          ? `Bearer ${token}`
          : "",

        ...(options.headers || {}),
      },
    }
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(
      data.message ||
        "API Error"
    );
  }

  return data;
}